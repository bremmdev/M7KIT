export type OTPInputProps = React.ComponentPropsWithRef<"div"> & {
  /**
   * The number of input fields to render, matching the length of the OTP code
   * @default 6
   */
  maxLength?: number;
  /**
   * The value of the OTP code
   */
  value?: string;
  /**
   * The function to call when the OTP code changes
   */
  onValueChange?: (otp: string) => void;
  /**
   * The function to call when the OTP code is complete
   */
  onComplete?: (otp: string) => void;
  /**
   * aria-label for the input
   * @default "One Time Password"
   */
  ariaLabel?: string;
};
