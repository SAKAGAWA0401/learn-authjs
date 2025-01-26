import ClientSession from "@/components/ClientSession";
import { SessionProvider } from "next-auth/react";
export default function ClientSide() {
  return (
    <SessionProvider>
      <ClientSession />
    </SessionProvider>
  );
}
  