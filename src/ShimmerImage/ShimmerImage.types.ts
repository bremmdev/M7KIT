export type ShimmerImageProps = React.ComponentPropsWithRef<"img"> & {
  /**
   * Determines if the image should be a circle
   * Image will be placed using object-cover and aspect-square
   * @default false
   */
  rounded?: boolean;
}