export type ShimmerImageProps = React.ComponentPropsWithRef<"img"> & {
  /**
   * Text alternative for the image (WCAG 1.1.1)
   * Pass an empty string for a decorative image, so screen readers skip it
   */
  alt: string;
  /**
   * Determines if the image should be a circle
   * Image will be placed using object-cover and aspect-square
   * @default false
   */
  rounded?: boolean;
};
