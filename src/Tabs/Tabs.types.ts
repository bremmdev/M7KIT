export interface TabsProps extends React.ComponentPropsWithRef<"div"> {
  defaultSelected: string;
  children: Array<React.ReactElement>;
}

export interface TabListProps extends React.ComponentPropsWithRef<"div"> {
  children: Array<React.ReactElement<TabProps>>;
}

export interface TabProps extends React.ComponentPropsWithRef<"button"> {
  label: string;
}

export interface TabContentProps extends React.ComponentPropsWithRef<"div"> {
  label: string;
}