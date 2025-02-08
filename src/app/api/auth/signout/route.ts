// app/api/auth/signout/route.ts
import { NextResponse } from "next/server";
import { signOut } from "@/auth"; // これはサーバー専用のモジュール

export async function POST() {
    // auth モジュールのサインアウト処理を実行（サーバー専用なので安全に利用できる）
    "use server";
    await signOut({ redirect: false });

    // サインアウト時にクッキーを削除するためのレスポンスを作成
    const response = NextResponse.json({ message: "Signed out" });
    response.headers.set(
        "Set-Cookie",
        `__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
    );

    return response;
}
