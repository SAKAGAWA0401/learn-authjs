// pages/api/auth/custom-signout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // NextAuth が発行するセッショントークンの cookie 名を確認してください
  // 例: "next-auth.session-token" または "__Secure-next-auth.session-token"
  res.setHeader("Set-Cookie", [
    `__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
  ]);
  res.status(200).json({ message: "Signed out" });
}
