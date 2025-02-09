import { HeaderComponent } from "@/components/HeaderComponent";
import { UserAuthClient } from "@/components/UserAuthClient";

export function Header() {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
        <HeaderComponent />
        <UserAuthClient />
      </div>
    </header>
  );
}
