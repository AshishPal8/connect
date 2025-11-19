"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import api from "@/lib/axios/client";

import { handleError } from "@/lib/handleError";
import { useUserStore } from "@/store/userStore";
import { coerceToDate, emptyToUndefined } from "@/lib/commonSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const onboardingSchema = z.object({
  gender: emptyToUndefined(z.enum(["MALE", "FEMALE", "OTHER"])).optional(),
  date: coerceToDate.optional(),
  interests: z.array(z.coerce.number().positive()).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"basic" | "category" | "interest">("basic");
  const [categories, setCategories] = useState<
    Array<{ id: number; title: string }>
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [interests, setInterests] = useState<
    Array<{ id: number; title: string }>
  >([]);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const router = useRouter();

  const { setUser } = useUserStore();

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema) as Resolver<OnboardingInput, any>,
    defaultValues: {
      gender: undefined,
      date: undefined,
      interests: [],
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/category");
        setCategories(response.data.data || []);
      } catch (error) {
        handleError(error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchInterests() {
      if (selectedCategories.length === 0) {
        setInterests([]);
        return;
      }

      setLoadingInterests(true);

      try {
        const response = await api.post("/category/interests", {
          categoryIds: selectedCategories,
        });
        setInterests(response.data.data || []);
      } catch (error) {
        handleError(error);
      } finally {
        setLoadingInterests(false);
      }
    }

    if (step === "interest") {
      fetchInterests();
    }
  }, [step, selectedCategories]);

  async function handleSubmit(values: z.infer<typeof onboardingSchema>) {
    if (step === "basic") {
      setStep("category");
      return;
    }

    if (step === "category") {
      if (selectedCategories.length === 0) {
        toast.error("Please select at least 1 category");
        return;
      }
      setStep("interest");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        gender: values.gender,
        date: values.date ? new Date(values.date).toISOString() : undefined,
        isOnboarded: true,
        interests: values.interests,
      };

      const response = await api.put("/user/update", payload);

      const { data } = await response.data;

      if (response.status === 200) {
        toast.success("Login successfully");
        router.push("/");
        setUser(data);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    if (step === "category") {
      setStep("basic");
    } else if (step === "interest") {
      setStep("category");
    }
  }

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, categoryId]);
      } else {
        toast.error("You can select up to 3 categories");
      }
    }
  };

  const toggleInterest = (interestId: number) => {
    const currentInterests = form.getValues("interests") || [];
    if (currentInterests.includes(interestId)) {
      form.setValue(
        "interests",
        currentInterests.filter((id) => id !== interestId)
      );
    } else {
      form.setValue("interests", [...currentInterests, interestId]);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-full md:w-2/4 flex items-center justify-center p-2 md:p-8">
        <Card className="w-full max-w-3xl mx-auto min-h-[80vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Meet</CardTitle>
            <CardDescription className="text-neutral-600">
              Meet like minded people
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <div className="flex gap-3 mb-2">
                <div
                  className={cn(
                    "w-20 h-[10px] rounded-full",
                    step === "basic" ? "bg-primary" : "bg-gray-500"
                  )}
                />
                <div
                  className={cn(
                    "w-20 h-[10px] rounded-full",
                    step === "category" ? "bg-primary" : "bg-gray-500"
                  )}
                />
                <div
                  className={cn(
                    "w-20 h-[10px] rounded-full",
                    step === "interest" ? "bg-primary" : "bg-gray-500"
                  )}
                />
              </div>
              <p className="text-foreground text-sm">
                {step === "basic" ? "1" : step === "category" ? "2" : "3"} of 3
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {step === "basic" && (
                  <>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? ""}
                              onValueChange={(val) => {
                                // convert "" => undefined so schema handles empty
                                field.onChange(val === "" ? undefined : val);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">
                                  No selection
                                </SelectItem>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === "category" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Select Categories (up to 3)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedCategories.length} of 3 selected
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          className={cn(
                            "h-auto py-4 rounded-md border duration-150 bg-secondary",
                            selectedCategories.includes(category.id)
                              ? "border-primary bg-primary/10 text-primary hover:bg-primary/10"
                              : "border-neutral-300 text-foreground hover:bg-primary/10"
                          )}
                          onClick={() => toggleCategory(category.id)}
                        >
                          {category.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {step === "interest" && (
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Your Interests</FormLabel>
                        <FormControl>
                          {loadingInterests ? (
                            <div className="flex items-center justify-center py-8">
                              <p className="text-muted-foreground">
                                Loading interests...
                              </p>
                            </div>
                          ) : interests.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                              <p className="text-muted-foreground">
                                No interests available
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {interests.map((interest) => (
                                <Button
                                  key={interest.id}
                                  type="button"
                                  className={cn(
                                    "h-auto py-4 rounded-md border duration-150 bg-secondary",
                                    field.value?.includes(interest.id)
                                      ? "border-primary bg-primary/10 text-primary hover:bg-primary/10"
                                      : "border-neutral-300 text-foreground hover:bg-primary/10"
                                  )}
                                  onClick={() => toggleInterest(interest.id)}
                                >
                                  {interest.title}
                                </Button>
                              ))}
                            </div>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-fit"
                    onClick={handleBack}
                    disabled={step === "basic"}
                  >
                    Back
                  </Button>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="lg"
                      type="submit"
                      className="w-fit"
                      disabled={isLoading}
                    >
                      Skip
                    </Button>
                    <Button
                      size="lg"
                      type="submit"
                      className="w-fit"
                      disabled={isLoading}
                    >
                      {step !== "interest"
                        ? "Next"
                        : isLoading
                        ? "Saving..."
                        : "Save"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            <CardDescription className="text-neutral-600 text-center mt-2"></CardDescription>
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
