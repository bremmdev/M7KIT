export interface TimelineProps extends React.ComponentPropsWithRef<"section"> {}
export interface TimelineItemProps
  extends React.ComponentPropsWithRef<"article"> {
  bullet?: React.ReactNode;
  lineClassName?: string;
}
