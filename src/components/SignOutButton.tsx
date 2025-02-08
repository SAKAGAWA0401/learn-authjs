"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/auth/signout", { method: "POST" });
            if (res.ok) {
                // サインアウト完了後、任意のページへリダイレクト
                router.push("/");
            } else {
                console.error("Sign out failed:", res.status);
            }
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

