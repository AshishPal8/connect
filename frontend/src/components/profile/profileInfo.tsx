"use client";
import { User } from "@/types/user";
import { Card } from "../ui/card";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import api from "@/lib/axios/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { handleError } from "@/lib/handleError";
import { useState } from "react";
import SocialInput from "../custom/SocialInput";
import { github, instagram, linkedin, other, twitter } from "@/assets";

export const profileInfoSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dob: z.date().max(new Date(), "Date must be in the past").optional(),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  location: z.string().min(3, "Location must be at least 3 characters long"),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  other: z.string().optional(),
});

const ProfileInfo = ({ user }: { user: User }) => {
  const router = useRouter();
  const { setUser } = useUserStore();

  console.log("User", user);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof profileInfoSchema>>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      name: user.name,
      gender: user.gender,
      dob: user.dob ? new Date(user.dob) : undefined,
      bio: user.bio,
      location: user.location,
      facebook: user.socials.find((s) => s.type === "TWITTER")?.url,
      twitter: user.socials.find((s) => s.type === "TWITTER")?.url,
      instagram: user.socials.find((s) => s.type === "TWITTER")?.url,
      linkedin: user.socials.find((s) => s.type === "TWITTER")?.url,
      github: user.socials.find((s) => s.type === "TWITTER")?.url,
      other: user.socials.find((s) => s.type === "TWITTER")?.url,
    },
  });

  async function onSubmit(values: z.infer<typeof profileInfoSchema>) {
    setLoading(true);
    try {
      const payload = {
        gender: values.gender,
        dob: values.dob ? new Date(values.dob).toISOString() : undefined,
        bio: values.bio,
        location: values.location,
        socials: [
          { type: "TWITTER", url: values.twitter },
          { type: "INSTAGRAM", url: values.instagram },
          { type: "LINKEDIN", url: values.linkedin },
          { type: "GITHUB", url: values.github },
          { type: "OTHER", url: values.other },
        ],
      };

      const response = await api.put("/user/update", payload);

      const data = await response.data;

      if (data.success) {
        toast.success("Login successfully");
        router.refresh();
        setUser(data.data);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full rounded-3xl p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
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
          <FormField
            control={form.control}
            name="dob"
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
                          !field.value && "text-muted-foreground",
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <SocialInput
                    image={twitter}
                    prefix="twitter.com"
                    placeholder="username"
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <SocialInput
                    image={instagram}
                    prefix="instagram.com"
                    placeholder="username"
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linkedin</FormLabel>
                <FormControl>
                  <SocialInput
                    image={linkedin}
                    prefix="linkedin.com/in"
                    placeholder="username"
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <SocialInput
                    image={github}
                    prefix="github.com"
                    placeholder="username"
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other</FormLabel>
                <FormControl>
                  <SocialInput
                    image={other}
                    prefix=""
                    placeholder=""
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Button type="submit" disabled={loading} variant="default">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileInfo;
