// src/lib/db.ts
import { neon } from "@neondatabase/serverless";

// 環境変数 DATABASE_URL が定義されているか確認
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// neon() を使って Neon 接続用の関数（SQLタグ付きテンプレート関数）をエクスポート
export const sql = neon(process.env.DATABASE_URL);
