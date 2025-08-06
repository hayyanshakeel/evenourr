"use client";
import * as React from "react";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple OTP Input without external dependencies to avoid type issues
const InputOTP = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
  }
>(({ className, maxLength = 6, value = "", onChange, ...props }, ref) => {
  const handleInputChange = (index: number, inputValue: string) => {
    const newValue = value.split('');
    newValue[index] = inputValue;
    onChange?.(newValue.join('').slice(0, maxLength));
  };

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {Array.from({ length: maxLength }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
          className="relative flex h-10 w-10 items-center justify-center border border-input text-sm text-center rounded-md"
        />
      ))}
    </div>
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ index, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 items-center justify-center border border-input text-sm rounded-md",
      className
    )}
    {...props}
  />
));
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };