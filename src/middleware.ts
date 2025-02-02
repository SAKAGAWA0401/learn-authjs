//export async function middleware() {} // middlewareファイルには必ずmiddleware関数を定義する
//export { auth as middleware } from "./auth"; //importしたものをそのままexportしている

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// matcherはmiddlewareが適用されるパスを指定する(正規表現で指定)
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/", "/(api|trpc)(.*)"],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const fpCookie = request.cookies.get('fpIssue');

  // 有効期限は30日（秒換算: 60*60*24*30）で、スライディングエクスパイアのため毎回更新する
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30, // 30日
    path: '/',
  };

  if (!fpCookie) {
    // cookie が存在しなければ新規に発行
    const newId = uuidv4();
    response.cookies.set('fpIssue', newId, cookieOptions);
  } else {
    // すでにある場合は、値はそのままに有効期限のみを更新（スライディングエクスパイア）
    response.cookies.set('fpIssue', fpCookie.value, cookieOptions);
  }
  return response;
}
