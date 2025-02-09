import NextAuth, { NextAuthConfig } from "next-auth"; // imrport the named export
import GoogleProvider from "next-auth/providers/google"; // import the default export
import AppleProvider from "next-auth/providers/apple";
import GitHubProvider from "next-auth/providers/github";
import LineProvider from "next-auth/providers/line";
import { sql } from "./lib/db";
// import TwitterProvider from "next-auth/providers/twitter";

// ": NextAuthConfig"でtypescriptのNextAuthConfig型を指定する
const config: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, // "!" はTypeScript に「この値は undefined ではない」と保証する
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: JSON.stringify({
                clientId: process.env.APPLE_CLIENT_ID,
                teamId: process.env.APPLE_TEAM_ID,      // Apple Developer Portal の Team ID
                keyId: process.env.APPLE_KEY_ID,        // Apple Developer Portal で発行した Key ID
                // 環境変数から取得した秘密鍵の改行を復元
                privateKey: process.env.APPLE_SECRET!,
            })
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        LineProvider({
            clientId: process.env.LINE_CLIENT_ID!,
            clientSecret: process.env.LINE_CLIENT_SECRET!,
        }),
        // TwitterProvider({
        //     clientId: process.env.TWITTER_ID!,
        //     clientSecret: process.env.TWITTER_SECRET!,
        //   }),
    ],
    secret: process.env.AUTH_SECRET!,
    pages: {
        signIn: "/auth/signin", // カスタムSignInページを指定
    },
    // 以下、callbacksは認証フロー中に実行されるカスタムロジックを定義する
    callbacks: {
        // 以下、reqが認証されたユーザによるものかを判断するmiddlewareを使ってreqを処理する際に利用される
        // callbacksは他にsignIn, session, redirectなどがある
        authorized({request, auth}) {
            try {
                const {pathname} = request.nextUrl; //分割代入 (Destructuring Assignment) -> reqの中にはnextUrl以外にもheadersやcookiesなどを含む
                if (pathname === "/protected-page") return !!auth; // !!auth はauthに値があればtrue, nullならfalse
                return true;
                // falseの際はログイン画面にリダイレクトされる
            } catch (error) {
                console.log(error);
            }
        },
        async jwt({ token, account, profile }) {
            if (account) {
                // provider: account.provider (例: "google", "apple", etc.)
                token.provider = account.provider;
                // providerごとのユーザIDはプロバイダーごとに名称が異なるので、profile から適切な値を抽出
                // Google / Apple: profile.sub, GitHub: profile.id, LINE: profile.userId
                token.userIdByProvider = profile?.sub || profile?.id || null;
                // 名前、メール、画像は provider によりフィールド名が異なる場合があるので、以下は一例です
                token.name = profile?.name || token.name || null;
                token.email = profile?.email || token.email || null;
                token.image = profile?.picture || profile?.avatar_url || null;
            }
            return token;
        },
          // セッション生成時に、JWT トークンから共通項目をセッションオブジェクトへ反映する
        async session({ session, token }) {
            session.user = {
                // 各項目を統一スキーマにマッピング
                provider: token.provider as string,
                userIdByProvider: token.userIdByProvider as string | null,
                name: token.name as string | null,
                email: token.email as string | null,
                image: token.image as string | null,
            };
            return session;
        },
        // ここで signIn コールバックを利用して、認証前にメールの重複をチェック
        async signIn({ account, profile }) {
            // account または profile からメールアドレスを取得
            const email = profile?.email;
            if (!email) {
                // メールアドレスが取得できなければ、認証を拒否する（またはエラーメッセージを設定）
                //return false;
                return "/auth/signin?error=NoEmailProvided";
            }
    
            try {
                // 指定されたメールアドレスで既にユーザが登録されているかチェック
                const existingUsers = await sql`
                    SELECT provider FROM users WHERE email = ${email}
                `;
                if (existingUsers.length > 0) {
                    // 既に登録されている場合、異なる provider で登録されているなら認証拒否
                    // （同じ provider であればログインとみなす）
                    if (existingUsers[0].provider !== account?.provider) {
                    // ここでエラーメッセージを返すなどしてユーザに通知する仕組みを用意すると良い
                    // return false;
                    return "/auth/signin?error=EmailAlreadyRegistered";
                    }
                }
                // 登録がなければ、認証プロセスを継続
                return true;
            } catch (error) {
                console.error("Error checking existing user by email:", error);
                //return false;
                return "/auth/signin?error=DatabaseError";
            }
        },        
    },
    // サインイン完了時のイベントでユーザ登録処理を実施
    events: {
        async signIn({ account, profile }) {
            // ここでは、session.user に設定される情報と同様の統一スキーマを利用
            const provider = account?.provider;
            const userIdByProvider = profile?.sub || profile?.id || null;
            const name = profile?.name || null;
            const email = profile?.email || null;
            const image = profile?.picture || profile?.avatar_url || null;

            try {
                // UPSET（存在すれば更新、なければ挿入）クエリの例
                await sql`
                INSERT INTO users (provider, user_id_by_provider, name, email, image)
                VALUES (${provider}, ${userIdByProvider}, ${name}, ${email}, ${image})
                ON CONFLICT (provider, user_id_by_provider)
                DO UPDATE SET
                    name = EXCLUDED.name,
                    email = EXCLUDED.email,
                    image = EXCLUDED.image,
                    updated_at = CURRENT_TIMESTAMP
                `;
            } catch (error) {
                console.error("Error registering user:", error);
            }
        },
    },
    // top domain cookieは上手くいかないためコメントアウト
    // cookieのカスタマイズ設定→SSO向けのトップドメインへの設定
    // cookies: {
    //     sessionToken: {
    //         name: "__Secure-authjs.session-token",
    //         options: {
    //             // ドメイン属性の設定
    //             domain: ".sloperiver.com",
    //             path: "/",
    //             // HTTPSを前提とする場合
    //             secure: true,
    //             httpOnly: true,
    //             // 必要に応じたSameSite属性の設定
    //             sameSite: "lax"
    //         }
    //     }
    //     // 他にも必要なクッキー設定があれば記載可能
    // },
    debug: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

