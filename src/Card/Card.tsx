import { CardProps, CardHeaderProps, CardContentProps } from "./Card.types";
import { cn } from "../utils/cn";

export const Card = <T extends React.ElementType = "div">(props: CardProps<T>) => {
    const { as = "div", children, className, image, imageAlt, imageHeight = "auto", imageClassName, ...rest } = props;
    const Component = as as React.ElementType;

    const imageStyle = imageHeight ? { height: imageHeight } : {};

    // If the card has an image, add a border to the bottom of the card and round the bottom corners
    const borderClass = image
        ? "border border-neutral dark:border-0 border-t-0 rounded-b-xl"
        : "border border-neutral dark:border-0 rounded-xl";

    return (
        <Component className={cn("w-fit text-foreground bg-surface rounded-xl overflow-hidden", className)} {...rest}>
            {image && <img src={image} alt={imageAlt} style={imageStyle} className={cn("w-full object-cover", imageClassName)} />}
            <div className={cn("flex flex-col gap-4 p-8", borderClass)}>
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

export const CardContent = <T extends React.ElementType = "div">(props: CardContentProps<T>) => {
    const { as = "div", children, className, ...rest } = props;
    const Component = as as React.ElementType;

    return (
        <Component className={cn("", className)} {...rest}>
            {children}
        </Component>
    );
};