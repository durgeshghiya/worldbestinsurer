"use client";

import { useState, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  error?: string;
  className?: string;
  variant?: "default" | "underline";
}

interface AnimatedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
  error?: string;
  className?: string;
}

export function AnimatedInput({
  label,
  error,
  className,
  variant = "default",
  value,
  onChange,
  ...props
}: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const hasValue = value !== undefined && value !== "";

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          variant === "default" ? "input-animated" : "input-underline",
          "relative",
          error && "input-error"
        )}
      >
        <input
          id={id}
          className={cn(
            "w-full bg-transparent px-4 pt-5 pb-2 text-[14px] text-text-primary outline-none",
            variant === "underline" && "px-0"
          )}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 pointer-events-none transition-all duration-200",
            variant === "underline" && "left-0",
            focused || hasValue
              ? "top-1.5 text-[10px] font-semibold text-primary"
              : "top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary"
          )}
          style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-[11px] text-danger font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}

export function AnimatedTextarea({
  label,
  error,
  className,
  value,
  onChange,
  ...props
}: AnimatedTextareaProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const hasValue = value !== undefined && value !== "";

  return (
    <div className={cn("relative", className)}>
      <div className={cn("input-animated relative", error && "input-error")}>
        <textarea
          id={id}
          className="w-full bg-transparent px-4 pt-6 pb-3 text-[14px] text-text-primary outline-none resize-none min-h-[120px]"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 pointer-events-none transition-all duration-200",
            focused || hasValue
              ? "top-1.5 text-[10px] font-semibold text-primary"
              : "top-4 text-[14px] text-text-tertiary"
          )}
          style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-[11px] text-danger font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
