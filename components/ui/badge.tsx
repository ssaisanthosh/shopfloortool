import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        destructive:
          "text-destructive-foreground border-transparent bg-destructive shadow-sm hover:bg-destructive/80",
        outline: "border-border text-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        category:
          "border-transparent bg-muted text-muted-foreground shadow-sm hover:bg-muted/80",
        count:
          "border-transparent bg-primary/10 text-primary shadow-sm hover:bg-primary/20",
        new:
          "border-transparent bg-[oklab(0.53_-0.13_0.08)] text-white shadow-sm hover:bg-[oklab(0.48_-0.12_0.07)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
