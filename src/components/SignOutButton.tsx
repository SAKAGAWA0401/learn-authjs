"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
      try {
        // 標準のサインアウト処理を呼び出し、UI上の認証状態をクリアする
        await signOut({ redirect: false });
        // カスタム API エンドポイントを呼び出し、JWT クッキーの削除（＝サーバー側で Set-Cookie ヘッダーを送信）
        await fetch("/api/auth/custom-signout", { method: "POST" });
        // サインアウト完了後、トップページ（または任意のページ）に遷移する
        router.push("/");
      } catch (error) {
        console.error("Error during sign out:", error);
      }
    };
  
    return (
      <Button onClick={handleSignOut}>
        Sign Out
      </Button>
    );
}

