type ButtonProps = React.ComponentPropsWithRef<"button"> | React.ComponentPropsWithRef<"a">;

export type CTAButtonProps = {
  href?: string;
} & ButtonProps;