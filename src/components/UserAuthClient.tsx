"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SignInButton } from "@/components/SignInButton";

// API から JSON を取得する fetcher 関数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UserAuthClient() {
  const router = useRouter();
  const { data, error, mutate } = useSWR("/api/auth/status", fetcher, {
    refreshInterval: 0,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);

  if (error) return <div>Error loading auth info.</div>;
  if (!data) return <div>Loading auth info...</div>;

  const { session } = data;

  // 未ログインの場合はサインイン用リンクを表示
  if (!session || !session.user) {
    return (
      <div>
        <SignInButton />
      </div>
    );
  }

  // サインアウト処理（API 経由でサインアウト＆クッキー削除）
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      if (res.ok) {
        // SWR のキャッシュ更新とページの再フェッチを促す
        mutate();
        router.refresh();
        router.push("/");
      } else {
        console.error("Sign out failed:", res.status);
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div className="relative inline-block">
      {/* マウスオーバーまたはクリックでドロップダウン表示 */}
      <div
        onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}
        onClick={() => setDropdownVisible((prev) => !prev)}
        className="cursor-pointer select-none"
      >
        <span className="text-gray-800">{session.user.email}</span>
      </div>

      {dropdownVisible && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
