import { NextResponse } from "next/server";
import { auth } from "@/auth"; // サーバー専用の auth 関数

// このエンドポイントは常に最新の認証状態を返すためにキャッシュしない
export const revalidate = 0;

export async function GET() {
  const session = await auth();
  return NextResponse.json({ session });
}
