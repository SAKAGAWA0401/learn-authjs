"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/auth/signout", { method: "POST" });
            if (res.ok) {
                router.push("/");
                console.error("Sign out successed:", res.status);
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

