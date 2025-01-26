import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

export function SignOutButton() {
    return (
        <form action={async () => {
            "use server";
            await signOut();
        }}>
            <Button>
                Sign Out
            </Button>
        </form>
    );
}

