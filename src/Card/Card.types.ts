export type BaseCardProps<T extends React.ElementType = "div"> = {
    as?: T;
} & Omit<React.ComponentProps<T>, "as">;

export type CardProps<T extends React.ElementType = "div"> = BaseCardProps<T>;
export type CardHeaderProps<T extends React.ElementType = "h3"> = BaseCardProps<T>;
export type CardFooterProps<T extends React.ElementType = "div"> = BaseCardProps<T>;
export type CardContentProps<T extends React.ElementType = "div"> = BaseCardProps<T>;