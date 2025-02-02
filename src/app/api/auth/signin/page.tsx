"use client";

import { Suspense } from "react";
import SignInContent from "@/components/SignInContent"; // 実際のサインインのUIを分割
// SignInContent.tsx 内で useSearchParams を利用

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
