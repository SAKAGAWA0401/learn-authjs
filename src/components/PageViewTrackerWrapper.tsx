// src/components/PageViewTrackerWrapper.tsx
"use client";

import usePageViewTracker from '@/hooks/usePageViewTracker';

export default function PageViewTrackerWrapper() {
  // クライアント側で実行されるので、usePageViewTracker を安全に呼び出せる
  usePageViewTracker();

  // このコンポーネント自体は何もレンダリングする必要がなければ null を返す
  return null;
}
