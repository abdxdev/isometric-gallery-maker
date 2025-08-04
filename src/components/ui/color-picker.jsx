import * as React from "react"
import { cn } from "@/lib/utils"

export function ColorPicker({
  className,
  value,
  onChange,
  ...props
}) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-transparent cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export { ColorPicker }
