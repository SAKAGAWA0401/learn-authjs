//export async function middleware() {} // middlewareファイルには必ずmiddleware関数を定義する

export { auth as middleware } from "./auth"; //importしたものをそのままexportしている

// matcherはmiddlewareが適用されるパスを指定する(正規表現で指定)
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/", "/(api|trpc)(.*)"],
};
