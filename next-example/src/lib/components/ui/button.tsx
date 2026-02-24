import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
    destructive:
      "bg-destructive hover:bg-destructive/90 text-white shadow-xs",
    outline:
      "bg-background hover:bg-accent hover:text-accent-foreground border border-input shadow-xs",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3",
    lg: "h-10 rounded-md px-6",
    icon: "size-9",
    "icon-sm": "size-8",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      href,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4";
    const classes = cn(
      base,
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      className
    );
    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
