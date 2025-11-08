"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import OAuth from "@/components/auth/oauth";
import api from "@/lib/axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { handleError } from "@/lib/handleError";
import { useUserStore } from "@/store/userStore";
import { useDebounce } from "use-debounce";
import { AlertCircle, CheckCircle, LoaderCircle } from "lucide-react";

export const signupSchema = z.object({
  username: z.string().min(1, { message: "username is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Enter a valid email" }),
  code: z.string().optional(),
});

export default function SignupForm() {
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    exists: boolean | null;
  }>({ checking: false, exists: null });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [tempCode, setTempCode] = useState("");
  const router = useRouter();

  const { setUser, setToken } = useUserStore();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", name: "", email: "", code: "" },
  });

  const username = form.watch("username");
  const debouncedUsername = useDebounce(username || "", 500)[0];

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameStatus({ checking: false, exists: null });
        return;
      }

      console.log("username", debouncedUsername);
      setUsernameStatus({ checking: true, exists: null });
      try {
        const res = await api.post(
          `/auth/check-username?u=${debouncedUsername}`
        );
        const data = res.data;

        if (data.success) {
          setUsernameStatus({ checking: false, exists: data.exists });
        }
      } catch (error) {
        handleError(error);
        setUsernameStatus({ checking: false, exists: null });
      }
    };
    checkUsername();
  }, [debouncedUsername]);

  async function handleRequestOtp(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        username: values.username,
        name: values.name,
        email: values.email,
      });

      const { data } = await response.data;

      if (response.status === 201) {
        toast.success("Enter otp");
        setStep("otp");
        setTempCode(data.code);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/verify", {
        email: values.email,
        code: values.code,
      });

      const { data } = await response.data;

      if (response.status === 200) {
        toast.success("Signed up successfully");
        router.push("/onboarding");
        setUser(data);
        setToken(data.token);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    const { email } = form.getValues();
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/resend", {
        email,
      });

      const data = await response.data;

      if (response.status === 201) {
        toast.success("Otp send successfully on your mail");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full">
      <div className="w-full md:w-2/4 flex items-center justify-center p-2 md:p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Join Us!</CardTitle>
            <CardDescription className="text-neutral-600">
              {step === "form"
                ? "Sign up to connect like minded peoples"
                : `Enter the code sent to mail, ${tempCode}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  step === "form" ? handleRequestOtp : handleVerifyOtp
                )}
                className="space-y-6"
              >
                {step === "form" && (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              {...field}
                            />
                          </FormControl>
                          {username && username.length >= 3 && (
                            <div className="flex items-center gap-2 mx-1">
                              {usernameStatus.checking ? (
                                <>
                                  <LoaderCircle
                                    size={12}
                                    className="animate-spin text-blue-500"
                                  />
                                  <p className="text-xs font-bold text-blue-500">
                                    Checking availability...
                                  </p>
                                </>
                              ) : usernameStatus.exists === true ? (
                                <>
                                  <AlertCircle
                                    size={12}
                                    className="text-red-500"
                                  />
                                  <p className="text-xs font-bold text-red-500">
                                    Username already taken
                                  </p>
                                </>
                              ) : usernameStatus.exists === false ? (
                                <>
                                  <CheckCircle
                                    size={12}
                                    className="text-green-500"
                                  />
                                  <p className="text-xs font-bold text-green-500">
                                    Username available
                                  </p>
                                </>
                              ) : null}
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === "otp" && (
                  <>
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OTP</FormLabel>
                          <FormControl>
                            <InputOTP
                              {...field}
                              maxLength={6}
                              className="w-full"
                            >
                              <InputOTPGroup className="flex justify-between items-center gap-2">
                                {[...Array(6)].map((_, index) => (
                                  <InputOTPSlot
                                    key={index}
                                    index={index}
                                    className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-xl font-semibold rounded-md border px-2 py-1"
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        className="p-0 h-0 text-end"
                        variant="ghost"
                        onClick={handleResendOtp}
                      >
                        Resend otp?
                      </Button>
                    </div>
                  </>
                )}

                <Button
                  size="lg"
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {step === "form" ? "Next" : "Verify & Register"}
                </Button>
              </form>
            </Form>
            <div className="flex items-center justify-center gap-2 overflow-hidden mt-5">
              <Separator />
              <p>OR</p>
              <Separator />
            </div>
            <OAuth />
            <CardDescription className="text-neutral-600 text-center mt-2">
              Already have an account{"  "}
              <Link
                href={"/signin"}
                className="text-primary underline font-semibold"
              >
                Sign in
              </Link>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div
        className="w-2/4 bg-cover bg-center hidden md:block bg-purple-600"
        // style={{ backgroundImage: "url(/article.webp)" }}
      />
    </div>
  );
}
