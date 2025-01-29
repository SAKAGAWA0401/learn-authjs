import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const cookie = serialize('cookie_id', 'unique_user_' + Math.random().toString(36).substring(7), {
    httpOnly: true, // JavaScriptからアクセス不可 (XSS対策)
    secure: true, // HTTPSのみ
    sameSite: 'lax', // lowercase
    maxAge: 60 * 60 * 24 * 365, // 1年間有効
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Cookie set successfully' });
}
