"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const providers = [
  { id: "google", name: "Google", logo: "/google.svg" },
  { id: "apple", name: "Apple", logo: "/apple.svg" },
  { id: "github", name: "GitHub", logo: "/github.svg" },
  { id: "line", name: "LINE", logo: "/line.svg" },
];
//データURL：https://authjs.dev/img/providers/google.svg

export default function SignInContent() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");

  // エラーコードに応じたエラーメッセージを定義
  const errorMessageMap: Record<string, string> = {
    EmailAlreadyRegistered: "このメールアドレスは他のプロバイダーで既に登録されています。",
    NoEmailProvided: "メールアドレスが取得できませんでした。",
    DatabaseError: "データベースエラーが発生しました。後ほど再度お試しください。",
  };

  const errorMessage = errorCode ? errorMessageMap[errorCode] || "不明なエラーが発生しました。" : null;

  const handleSignIn = (providerId: string) => {
    if (selectedProvider === providerId && isConfirmed) {
      // 2回目のクリックで実際のsignInを実行
      signIn(providerId);
    } else {
      // 1回目のクリックでプロバイダーをセットし、注意文を表示
      setSelectedProvider(providerId);
      setIsConfirmed(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h1 className="text-lg font-semibold text-center mb-4">
          Sign in to your account
        </h1>

        {/* エラーメッセージの表示 */}
        {errorMessage && (
          <div className="mb-4 p-3 border border-red-500 rounded bg-red-100 text-red-700">
            {errorMessage}
          </div>
        )}

        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSignIn(provider.id)}
            className="w-full flex items-center justify-between px-4 py-2 border rounded-lg mb-3 hover:bg-gray-200 transition"
          >
            <span>Sign in with {provider.name}</span>
            <Image
              src={provider.logo}
              alt={provider.name}
              width={24}
              height={24}
            />
          </button>
        ))}

        {/* LINE選択時のみ注意書きを表示 */}
        {selectedProvider === "line" && isConfirmed && (
          <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50 text-sm text-gray-700">
            <p className="font-semibold mb-1">LINEアカウントを利用してユーザ認証を行う場合のみ、</p>
            <p>
              あなたのLINEアカウントに登録されているメールアドレスを取得します。
              取得したメールアドレスは以下の目的以外では使用いたしません。
              また、法令に定められた場合を除き第三者への提供はいたしません。
            </p>
            <p className="mt-2 font-semibold">【取得目的】</p>
            <ul className="list-disc pl-5">
              <li>本サービスのユーザIDとしてアカウントの管理のため</li>
              <li>退会や問い合わせ時などの連絡のため</li>
            </ul>
            <p className="mt-2 text-red-500 text-center font-bold">
              再度Sign inボタンを押すとログインが開始されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
