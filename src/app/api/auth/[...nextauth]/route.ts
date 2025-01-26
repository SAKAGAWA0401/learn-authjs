// directoryのスプレッド構文[...nextauth]はパスの一部をキャプチャする
// Next.jsのdynamic routesを利用している

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
