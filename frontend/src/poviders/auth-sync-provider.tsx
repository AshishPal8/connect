"use client";

import { useAuthSync } from "@/lib/auth-sinc";

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  useAuthSync();
  return <>{children}</>;
}
