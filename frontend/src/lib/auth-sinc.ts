"use client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import api from "./axios/client";

export function useAuthSync() {
  const router = useRouter();
  const { token, logout } = useUserStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current || !token) return;
    hasChecked.current = true;

    const checkAuthsinc = async () => {
      try {
        const res = await api.get("/user/me");

        if (res.status === 401) {
          logout();
          router.push("/signin");
        }
      } catch (error) {
        console.error("Auth sync failed:", error);
      }
    };

    checkAuthsinc();
  }, []);
}
