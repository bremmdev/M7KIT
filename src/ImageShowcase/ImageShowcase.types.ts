export type ImageShowcaseProps = React.ComponentPropsWithRef<"div"> & {
  /**
   * The amount the image should grow on hover
   * @default 2
   */
  growFactor?: 1.5 | 2 | 2.5 | 3;
};
