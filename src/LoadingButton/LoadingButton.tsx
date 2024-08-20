import { LoadingButtonProps } from "./LoadingButton.types";
import { cn } from "../utils/cn";
import { LoaderCircle, Loader } from "lucide-react";

export const LoadingButton = (props: LoadingButtonProps) => {
  const { children, className, icon = "loader-circle", loading, ...rest } = props;

  const LoaderIcon = icon === "loader-circle" ? LoaderCircle : Loader

  return (
    <button
      disabled={loading}
      className={cn(
        "relative flex border-none justify-center items-center px-4 py-2 bg-clr-accent text-clr-text-inverted rounded-md font-medium w-fit hover:bg-opacity-90 transition-colors focus-ring-neutral",
        className
      )}
      {...rest}
    >
      {loading && (
        <span className="absolute inset-0 bg-inherit rounded-md flex justify-center items-center">
          <LoaderIcon className="animate-spin size-6" />
        </span>
      )}
      {children}
    </button>
  );
};
