import z from "zod";

export const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);

export const coerceToDate = z.preprocess((val) => {
  if (!val) return undefined;
  if (val instanceof Date) return val;
  if (
    typeof val === "number" ||
    (typeof val === "string" && /^\d+$/.test(val))
  ) {
    return new Date(Number(val));
  }
  if (typeof val === "string") {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}, z.date().max(new Date(), { message: "Date must be in the past" }));
