import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export const GET = async () => {
  const cookie = serialize('cookie_id', 'unique_user_' + Math.random().toString(36).substring(7), {
    httpOnly: true, // JavaScriptからアクセス不可 (XSS対策)
    secure: process.env.NODE_ENV === 'production', // 本番環境のみ `secure: true`
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1年間有効
    path: '/',
  });

  const response = NextResponse.json({ message: 'Cookie set successfully' });
  response.headers.set('Set-Cookie', cookie);

  return response;
};
