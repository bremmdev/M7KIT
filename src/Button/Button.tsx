import React from "react";
import type { ButtonProps, AllowedElements } from "./Button.types";
import { cn } from "../utils/cn";
import { Loader, LoaderCircle, MoveRight } from "lucide-react";
import { getButtonVariantClasses } from "./Button.utils";

export const Button = <E extends AllowedElements | React.ComponentType<any> = "button">(
    props: ButtonProps<E>
) => {
    const { as = "button", children, className, isLoading = false, loadingIcon = "loader-circle", variant = "primary", ...rest } = props;

    const Component = as as React.ElementType;
    const LoaderIcon = loadingIcon === "loader-circle" ? LoaderCircle : Loader;

    return (
        <Component
            className={cn(
                "group overflow-hidden relative flex gap-2 cursor-pointer justify-center items-center px-4 py-2 rounded-md font-bold w-fit transition-opacity disabled:opacity-50 dark:disabled:opacity-0 disabled:cursor-not-allowed",
                getButtonVariantClasses(variant),
                className
            )}
            disabled={isLoading}
            {...rest}
        >
            {children}
            {isLoading && (
                <span className="absolute inset-0 bg-inherit rounded-md flex justify-center items-center">
                    <LoaderIcon className="animate-spin size-6 text-foreground-inverse dark:text-foreground" />
                </span>
            )}
            {variant === "cta" && !isLoading && (<><MoveRight className="size-5 group-hover:translate-x-1 transition-transform ease-in-out" /><span className="inline-block absolute -top-4 -bottom-4 -left-[50%] bg-surface dark:bg-foreground opacity-50 w-5 z-10 rotate-35 transition-all group-hover:left-[125%] duration-1000" /></>)}
        </Component>
    );
};
