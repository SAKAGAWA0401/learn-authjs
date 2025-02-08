"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
      try {
        await fetch("/api/auth/custom-signout", { method: "POST" });
        // サインアウト完了後、トップページ（または任意のページ）に遷移する
        router.push("/");
      } catch (error) {
        console.error("Error during sign out:", error);
      }
    };
  
    return (
      <Button onClick={handleSignOut}>
        Sign Out
      </Button>
    );
}

