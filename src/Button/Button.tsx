import React from "react";
import type { ButtonProps, AllowedElements } from "./Button.types";
import { cn } from "../utils/cn";
import { Loader, LoaderCircle, MoveRight } from "lucide-react";
import { getButtonVariantClasses } from "./Button.utils";

export const Button = <E extends AllowedElements | React.ComponentType<any> = "button">(props: ButtonProps<E>) => {
  const {
    as = "button",
    children,
    className,
    isLoading = false,
    loadingIcon = "loader-circle",
    variant = "primary",
    ...rest
  } = props;

  const Component = as as React.ElementType;
  const LoaderIcon = loadingIcon === "loader-circle" ? LoaderCircle : Loader;

  // `disabled` and the `type` default only mean something on a real <button>. On an anchor or a
  // router link component `disabled` is an invalid attribute that blocks nothing, so the loading
  // state is signalled with aria-disabled there and the pointer events are taken away with CSS.
  const isNativeButton = Component === "button";
  const { disabled, type, ...restProps } = rest as { disabled?: boolean; type?: string };
  const isDisabled = isLoading || Boolean(disabled);
  const elementProps = isNativeButton
    ? { disabled: isDisabled, type: type ?? "button" }
    : { disabled, type, "aria-disabled": isDisabled || undefined };

  // Forced colors (Windows high contrast) replace the fill with ButtonFace, so the primary and cta variants get a border
  // there to keep their shape (the secondary variant already has one). Disabled and loading use GrayText instead of the opacity,
  // which would make GrayText too faint. The loader keeps its explicit text color, so it gets GrayText too.
  // The hover background is replaced too, so hover shows as a Highlight border there
  return (
    <Component
      {...restProps}
      {...elementProps}
      aria-busy={isLoading || undefined}
      className={cn(
        "group overflow-hidden relative flex gap-2 cursor-pointer justify-center items-center px-4 py-2 rounded-md font-bold w-fit transition-opacity disabled:opacity-50 dark:disabled:opacity-70 disabled:cursor-not-allowed aria-disabled:opacity-50 dark:aria-disabled:opacity-70 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
        "forced-colors:hover:border-[Highlight] forced-colors:disabled:opacity-100 forced-colors:disabled:text-[GrayText] forced-colors:disabled:border-[GrayText] forced-colors:aria-disabled:opacity-100 forced-colors:aria-disabled:text-[GrayText] forced-colors:aria-disabled:border-[GrayText]",
        getButtonVariantClasses(variant),
        className
      )}
    >
      {children}
      {isLoading && (
        <span className="absolute inset-0 bg-inherit dark:bg-inherit rounded-md flex justify-center items-center">
          <LoaderIcon className="animate-spin size-6 text-foreground-inverse dark:text-foreground forced-colors:text-[GrayText]" />
        </span>
      )}
      {variant === "cta" && !isLoading && (
        <>
          <MoveRight className="size-5 group-hover:translate-x-1 transition-transform ease-in-out" />
          {/* Decorative shine. Forced colors would turn it into a half-transparent Canvas bar over the text, so it is hidden there */}
          <span className="inline-block absolute -top-4 -bottom-4 left-[-50%] bg-surface dark:bg-foreground opacity-50 w-5 z-10 rotate-35 transition-all group-hover:left-[125%] duration-1000 forced-colors:hidden" />
        </>
      )}
    </Component>
  );
};
