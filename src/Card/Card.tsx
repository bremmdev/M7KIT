import { CardProps, CardHeaderProps, CardFooterProps, CardContentProps } from "./Card.types";
import { cn } from "../utils/cn";

export const Card = <T extends React.ElementType = "div">(props: CardProps<T>) => {
    const { as = "div", children, className, ...rest } = props;
    const Component = as as React.ElementType;
    return (
        <Component className={cn("w-fit text-foreground bg-surface border border-neutral dark:border-none rounded-xl p-8", className)} {...rest}>
            <div className="flex flex-col gap-4">
                {children}
            </div>
        </Component>
    );
};

export const CardHeader = <T extends React.ElementType = "h3">(props: CardHeaderProps<T>) => {
    const { as = "h3", children, className, ...rest } = props;
    const Component = as as React.ElementType;
    return (
        <Component className={cn("text-lg font-bold", className)} {...rest}>
            {children}
        </Component>
    );
};

export const CardFooter = <T extends React.ElementType = "div">(props: CardFooterProps<T>) => {
    const { as = "div", children, className, ...rest } = props;
    const Component = as as React.ElementType;
    return (
        <Component className={cn("flex flex-col gap-2", className)} {...rest}>
            {children}
        </Component>
    );
};

export const CardContent = <T extends React.ElementType = "div">(props: CardContentProps<T>) => {
    const { as = "div", children, className, ...rest } = props;
    const Component = as as React.ElementType;
    return (
        <Component className={cn("", className)} {...rest}>
            {children}
        </Component>
    );
};