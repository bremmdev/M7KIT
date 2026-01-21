export type BaseCardProps<T extends React.ElementType = "div"> = {
    as?: T;
} & Omit<React.ComponentProps<T>, "as">;

export type CardProps<T extends React.ElementType = "div"> = BaseCardProps<T> & {
    /**
     * The url of the image to display in the card
     * @default undefined
     */
    image?: string;
    /**
     * The alt text of the image
     * @default undefined
     */
    imageAlt?: string;
    /**
     * The height of the image in pixels
     * @default "auto"
     */
    imageHeight?: number | "auto";
    /**
     * Classname overrides for the image
     * @default undefined
     */
    imageClassName?: string;
};
export type CardTitleProps<T extends React.ElementType = "h3"> = BaseCardProps<T>;
export type CardContentProps<T extends React.ElementType = "div"> = BaseCardProps<T>;