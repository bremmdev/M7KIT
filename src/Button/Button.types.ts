type AllowedElements = "button" | "a";
export type ButtonVariant = "primary" | "secondary" | "cta";

// For custom components (Next Link, TanStack Router Link, etc.)
type PolymorphicProps<
    E extends AllowedElements | React.ComponentType<any>, // the element type to be used
    OwnProps = {} // our custom props to be passed to the component
> = OwnProps & {
    as?: E;
} & Omit<
    E extends AllowedElements
    ? React.ComponentPropsWithoutRef<E>
    : E extends React.ComponentType<infer P>
    ? P
    : never,
    keyof OwnProps | "as" // exclude the own props and the as prop from the component props
>;

type ButtonOwnProps = {
    isLoading?: boolean;
    /**
     * The lucide icon to display while in the loading state
     * @default "loader-circle"
    */
    loadingIcon?: "loader-circle" | "loader";
    /**
     * The variant of the button
     * @default "primary"
     */
    variant?: ButtonVariant;
};

export type ButtonProps<
    E extends AllowedElements | React.ComponentType<any> = "button"
> = PolymorphicProps<E, ButtonOwnProps>;