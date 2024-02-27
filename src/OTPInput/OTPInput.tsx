import React from "react";
import { OTPInputProps } from "./OTPInput.types";
import { cn } from "../utils/cn";
import { validateValue } from "./OTPInput.utils";

const Cursor = () => (
  <div className="animate-blink w-px h-8 bg-slate-950 dark:bg-white" />
);

export const OTPInput = (props: OTPInputProps) => {
  const {
    maxLength = 6,
    value,
    onValueChange,
    onComplete,
    ariaLabel = "One Time Password",
    className,
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [otp, setOtp] = React.useState(() =>
    validateValue(value || "", maxLength)
  );
  const [isFocused, setIsFocused] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    //we check validity against the pattern to ensure that only numbers are entered
    if (e.target.validity.valid) {
      setOtp(newValue);
      onValueChange?.(newValue);
      setCursorPosition((prev) => prev + 1);

      if (newValue.length === maxLength) {
        onComplete?.(newValue);
        setOtp("");
      }
    }
  };

  const handleOnFocus = () => {
    setIsFocused(true);
    inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
  };

  return (
    <div
      data-otp-container="true"
      className={cn("flex text-3xl relative w-fit", className)}
    >
      {Array.from({ length: maxLength }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "flex justify-center items-center border border-slate-300 border-r-0 w-12 h-16 first-of-type:rounded-s-md last-of-type:rounded-e-md last-of-type:border-r bg-slate-50 dark:border-slate-500 dark:bg-slate-950",
            {
              "border-2 border-slate-950 last-of-type:border- dark:border-white":
                otp.length === idx && isFocused,
            }
          )}
        >
          {otp[idx] || ""}
          {otp.length === idx && isFocused && <Cursor />}
        </div>
      ))}
      <input
        ref={inputRef}
        inputMode="numeric"
        pattern="^\d+$"
        autoComplete="one-time-code"
        className="absolute inset-0 bg-transparent text-transparent opacity-0"
        value={otp}
        name="otp"
        aria-label={ariaLabel}
        maxLength={maxLength}
        onFocus={handleOnFocus}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
      />
    </div>
  );
};
