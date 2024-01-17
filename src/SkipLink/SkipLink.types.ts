export interface SkipLinkProps extends React.ComponentPropsWithRef<"a"> {
  /**
   * The text to display for the skip link
   * @default 'Skip to main content'
   */
  text?: string;
  /**
   * The id of the element to skip to
   * @default main
   */
  targetId?: string;
}
