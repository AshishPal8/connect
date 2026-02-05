import z from "zod";
import { coerceToDate, genderEnum } from "../../utils/commonSchema";

const interestId = z.coerce.number().int().positive();

const socialTypeEnum = z.enum([
  "TWITTER",
  "INSTAGRAM",
  "LINKEDIN",
  "FACEBOOK",
  "GITHUB",
  "OTHER",
]);

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z
    .string()
    .min(10)
    .max(20)
    .regex(/^[+\d\-\s()]*$/, { message: "Invalid phone format" })
    .optional(),
  profilePicture: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.url().optional(),
  ),
  dob: coerceToDate.optional(),
  gender: genderEnum.optional(),
  isOnboarded: z.boolean().default(false),
  bio: z.string().max(2000).optional(),
  interests: z.array(interestId).max(200).optional(),
  location: z.string().optional(),
  socials: z
    .array(
      z.object({
        type: socialTypeEnum,
        url: z
          .url({ error: "Invalid url format" })
          .max(500, { error: "URL to long" }),
      }),
    )
    .optional(),
});

export type updateUserInput = z.infer<typeof updateUserSchema>;
