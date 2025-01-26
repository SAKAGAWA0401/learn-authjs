import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    // ログインしていない場合はトップページにリダイレクト
    // middlewareでも管理可能だが、各ページでの設定が推奨されている
    const session = await auth();
    if (!session)  return redirect("/");
    return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p>This page is only accessible to authenticated users.</p>
        </div>
      );
}

