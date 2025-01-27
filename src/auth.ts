import NextAuth, { NextAuthConfig } from "next-auth"; // imrport the named export
import GoogleProvider from "next-auth/providers/google"; // import the default export
import GitHubProvider from "next-auth/providers/github";
import LineProvider from "next-auth/providers/line";
// import TwitterProvider from "next-auth/providers/twitter";
// import AppleProvider from "next-auth/providers/apple";

// ": NextAuthConfig"でtypescriptのNextAuthConfig型を指定する
const config: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, // "!" はTypeScript に「この値は undefined ではない」と保証する
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
        // AppleProvider({
        //     clientId: process.env.APPLE_ID!,
        //     clientSecret: process.env.APPLE_SECRET!,
        //   }),
    ],
    secret: process.env.AUTH_SECRET!,
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
        // redirect({url, baseUrl}) {
        //     if (url.startsWith("/")) return `${baseUrl}${url}`;
        //     return baseUrl;
        // },
        // jwt({token, trigger, session}) {
        //     if (trigger === "update") {
        //         token.name = session.user.name;
        //     }
        //     return token;
        // },
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

