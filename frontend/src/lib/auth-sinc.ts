"use client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "./axios/client";

export function useAuthSync() {
  const router = useRouter();
  const { token, logout } = useUserStore();

  useEffect(() => {
    const checkAuthsinc = async () => {
      if (token) {
        try {
          const res = await api.get("/user/me");

          if (res.status === 401) {
            logout();
            router.push("/signin");
          }
        } catch (error) {
          console.error("Auth sync failed:", error);
        }
      }
    };

    checkAuthsinc();
  }, [token, logout, router]);
}
