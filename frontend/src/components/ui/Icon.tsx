import { LucideIcon } from "lucide-react";

interface IconProp {
  icon: LucideIcon;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const Icon = ({
  icon: IconComponent,
  size,
  color,
  className,
  onClick,
}: IconProp) => {
  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      onClick={onClick}
    />
  );
};

export default Icon;
