import Image, { StaticImageData } from "next/image";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface SocialInputProps {
  image: StaticImageData;
  prefix: string; // e.g., "facebook.com"
  placeholder: string;
  field: any;
  className?: string;
}

const SocialInput = ({
  image,
  prefix,
  placeholder,
  field,
  className,
}: SocialInputProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Image src={image} alt="" width={18} height={18} />
      </div>

      <Input
        {...field}
        value={field.value || ""}
        placeholder={placeholder}
        onChange={(e) => field.onChange(e.target.value)}
        className={cn("w-full h-10", className)}
        style={{ paddingLeft: "40px" }}
      />
    </div>
  );
};

export default SocialInput;
