// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      provider: string;
      userIdByProvider: string | null;
      name: string | null;
      email: string | null;
      image: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    provider?: string;
    userIdByProvider?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
