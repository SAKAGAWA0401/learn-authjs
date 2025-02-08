import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

export function SignOutButton() {
    return (
        <form action={async () => {
            "use server";
            await signOut({ redirect: false });
            await fetch("api/auth/custom-signout", { method: "POST" });
            window.location.href = "/";
        }}>
            <Button>
                Sign Out
            </Button>
        </form>
    );
}

