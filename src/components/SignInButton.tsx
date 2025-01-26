import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";

export function SignInButton() {
    return (
        <form action={async () => {
            "use server";
            await signIn();
        }}>
            <Button>
                Sign In
            </Button>
        </form>
    );
/** 以下でも可能（use serverを使わない）
 * メールアドレスとパスワード認証を許可する場合は、上の設定を必須にして、サーバー処理を実装する必要がある
    return (
        <Button onClick={async () => {
            await signIn();
        }}>
            Sign In
        </Button>
    );    
**/
}

