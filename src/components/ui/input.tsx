import * as React from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-2 text-sm text-white outline-none transition placeholder:text-[#717171] focus:border-[#5e92ff] focus:bg-[#0f111a] focus:ring-4 focus:ring-[#5e92ff]/15 disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";

export { Input, type InputProps };
