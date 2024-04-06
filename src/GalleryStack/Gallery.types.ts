export type GalleryStackProps = React.ComponentPropsWithRef<"div"> & {
  children: React.ReactNode[];
  /**
   * The additional amount of rotation in degrees applied to each child element in the gallery
   * first child will have 0 degrees of rotation, second child will have 3 degrees of rotation, third child will have 6 degrees of rotation, and so on
   * @default 3
   */
  rotationAmount?: number;
  /**
   * If true, the order of the children will be reversed, i.e first child will be on top of the stack and the last child will be at the bottom
   * @default false
   */
  reversed?: boolean;
  /**
   * The duration of the animation in milliseconds
   * @default 2000
   */
  animationDuration?: number;
};

export type animationDirection = "forward" | "backward" | "idle";

export type NavigationButtonProps = React.ComponentPropsWithRef<"div"> & {
  /**
   * The direction of the animation
   */
  animationDirection: animationDirection;
  /**
   * The callback function to be called when the button is clicked, used to rotate the stack
   */
  onNavigate: (idx: number) => void;
  /**
   * The index of last item of the stack
   */
  lastItemIdx: number;
};
