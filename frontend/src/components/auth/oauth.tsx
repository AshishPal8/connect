"use client";
import React from "react";
import Image from "next/image";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import api from "@/lib/axios/client";
import { useUserStore } from "@/store/userStore";
import { handleError } from "@/lib/handleError";
import { toast } from "sonner";

function OAuth() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const response = await api.post("/auth/google", {
          credential: credentialResponse.access_token,
        });

        const { data } = response.data;
        setUser(data);
        setToken(data.token);
        router.push(data.isOnboarded ? "/" : "/onboarding");
      } catch (error) {
        handleError(error);
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <div className="w-full flex items-center justify-center my-5">
      <Button
        onClick={() => login()}
        size="lg"
        variant="outline"
        className="w-full"
      >
        <Image src="/google.png" alt="Google" width={25} height={25} /> Continue
        with Google
      </Button>
    </div>
  );
}

export default OAuth;
