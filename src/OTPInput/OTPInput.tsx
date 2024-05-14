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
    ...rest
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [otp, setOtp] = React.useState(() =>
    validateValue(value || "", maxLength)
  );
  const [isFocused, setIsFocused] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState(0);

  const handleOnComplete = (newValue: string) => {
    onComplete?.(newValue);
    setOtp("");
    setCursorPosition(0);
  };

  const setCursorPositionAndSelectText = (newCursorPosition: number) => {
    setCursorPosition(newCursorPosition);
    inputRef.current?.setSelectionRange(
      newCursorPosition,
      newCursorPosition + 1
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    //we check validity against the pattern to ensure that only numbers are entered
    if (e.target.validity.valid) {
      setOtp(newValue);
      onValueChange?.(newValue);
      const newCursorPosition = cursorPosition + 1;
      setCursorPosition((prev) => prev + 1);

      // if the cursor is at the end of the input, we add the new value to the end
      if (cursorPosition !== otp.length) {
        setCursorPositionAndSelectText(newCursorPosition);
      }

      if (newValue.length === maxLength) {
        handleOnComplete(newValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && cursorPosition > 0) {
      e.preventDefault();
      const newCursorPosition = cursorPosition - 1;

      setOtp((prev) => {
        const newValue =
          prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition);
        onValueChange?.(newValue);
        return newValue;
      });
      setCursorPosition(newCursorPosition);
    }

    if (e.key === "ArrowRight" && cursorPosition < otp.length) {
      e.preventDefault();
      const newCursorPosition = cursorPosition + 1;
      setCursorPositionAndSelectText(newCursorPosition);
    }

    if (e.key === "ArrowLeft" && cursorPosition > 0) {
      e.preventDefault();
      const newCursorPosition = cursorPosition - 1;
      setCursorPositionAndSelectText(newCursorPosition);
    }
  };

  const handleOnFocus = () => {
    setIsFocused(true);
    setCursorPosition(otp.length);
    inputRef.current?.setSelectionRange(otp.length, otp.length);
  };

  return (
    <div
      data-otp-container="true"
      className={cn("flex text-3xl relative w-fit", className)}
      {...rest}
    >
      {Array.from({ length: maxLength }).map((_, idx) => {
        const isAtEmptyPosition = idx === otp.length && idx === cursorPosition;
        const showCursor = isAtEmptyPosition && isFocused;
        return (
          <div
            key={idx}
            className={cn(
              "flex justify-center items-center border border-slate-300 border-r-0 w-12 h-16 first-of-type:rounded-s-md last-of-type:rounded-e-md last-of-type:border-r bg-slate-50 dark:border-slate-500 dark:bg-slate-950",
              {
                "border-2 border-slate-950 last-of-type:border- dark:border-white":
                  cursorPosition === idx && isFocused,
              }
            )}
          >
            {otp[idx] || ""}
            {showCursor && <Cursor />}
          </div>
        );
      })}

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
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
