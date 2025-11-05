import z from "zod";

export const coerceToDate = z.preprocess((val) => {
  if (!val) return undefined;
  // If it's already a date object
  if (val instanceof Date) return val;
  // If it's a number (unix ms) or numeric string
  if (
    typeof val === "number" ||
    (typeof val === "string" && /^\d+$/.test(val))
  ) {
    const n = Number(val);
    return new Date(n);
  }
  // Otherwise try to parse as ISO string
  if (typeof val === "string") {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().max(new Date(), { message: "DOB must be in the past" }));

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
