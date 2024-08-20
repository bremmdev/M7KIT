export type LoadingButtonProps = React.ComponentProps<"button"> & {
  loading: boolean;
  /**
   * The lucide icon to display while in the loading state
   * @default "loader-circle"
   */
  icon?: "loader-circle" | "loader";
};
