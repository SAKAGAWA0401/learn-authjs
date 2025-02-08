// app/api/auth/custom-signout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out" });
  // クッキーを削除するための Set-Cookie ヘッダーを設定
  response.headers.set(
    "Set-Cookie",
    `__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
  );
  return response;
}
