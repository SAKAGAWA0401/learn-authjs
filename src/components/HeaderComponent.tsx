"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Home", href: "/" },
  { name: "Client Side", href: "/client-side" },
  { name: "Server Side", href: "/server-side" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Protected Page", href: "/protected-page" },
];

export function HeaderComponent() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
        <nav className="flex justify-center space-x-4 py-4">
            {tabs.map((tab) => (
            <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                pathname === tab.href
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
            >
                {tab.name}
            </Link>
            ))}
        </nav>
    </header>
  );
}
