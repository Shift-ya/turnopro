import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5e92ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606] disabled:cursor-not-allowed disabled:opacity-60";

    const variants = {
      default: "bg-[#5e92ff] text-white shadow-[0_16px_30px_rgba(94,146,255,0.26)] hover:-translate-y-0.5 hover:bg-[#4f82ef]",
      outline: "border border-white/10 bg-white/5 text-white hover:-translate-y-0.5 hover:bg-white/10",
      destructive: "bg-[#ef4f7f] text-white shadow-[0_16px_30px_rgba(239,79,127,0.22)] hover:-translate-y-0.5 hover:bg-[#df3f70]",
      ghost: "text-white/80 hover:bg-white/8 hover:text-white",
      secondary: "bg-[#0f1222] text-[#bfd0ff] border border-white/10 hover:-translate-y-0.5 hover:bg-[#151a32]",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return <Comp className={cn(baseStyles, variants[variant], sizes[size], className)} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps };
