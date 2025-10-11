import React from "react";
import {
  SegmentedControlProps,
  SegmentedControlButtonProps,
} from "./SegmentedControl.types";
import { cn } from "../utils/cn";

type SegmentedControlContext = {
  selected: string;
  setSelected: (selected: string) => void;
};

const SegmentedControlContext = React.createContext<SegmentedControlContext>({
  selected: "",
  setSelected: () => {},
});

export const SegmentedControlButton = (props: SegmentedControlButtonProps) => {
  const {
    children,
    className,
    defaultSelected = false,
    value,
    ...rest
  } = props;

  const { selected, setSelected } = React.useContext(SegmentedControlContext);

  React.useEffect(() => {
    if (defaultSelected) {
      setSelected(value || (children as string));
    }
  }, [value, defaultSelected, setSelected, children]);

  // Use the value prop if provided, otherwise use the children as the value to be passed to the onValueChange callback
  const buttonValue = value || (children as string);

  return (
    <li className="[&:first-of-type>button]:rounded-l-md [&:last-of-type>button]:rounded-r-md">
      <button
        className={cn(
          "relative px-4 py-2 bg-surface-muted hover:bg-surface-muted/70 transition-colors border-transparent text-foreground focus-ring-neutral-inner focus-visible:z-10 focus-visible:rounded-md",
          {
            "border border-foreground font-medium rounded-md bg-surface-subtle hover:bg-surface-subtle":
              selected === buttonValue,
          },
          className
        )}
        type="button"
        aria-current={
          buttonValue && selected === buttonValue ? "true" : undefined
        }
        onClick={() => setSelected(buttonValue)}
        {...rest}
      >
        {children}
      </button>
    </li>
  );
};

export const SegmentedControl = (props: SegmentedControlProps) => {
  const { children, className, onValueChange, ...rest } = props;

  const [selected, setSelected] = React.useState<string>("");
  const ignoreChangeRef = React.useRef(true);

  React.useEffect(() => {
    if (selected && onValueChange) {
      if (!ignoreChangeRef.current) {
        onValueChange(selected);
      } else {
        ignoreChangeRef.current = false;
      }
    }
  }, [selected, onValueChange]);

  //set the ignoreChangeRef to false if there is no default selected button
  React.useEffect(() => {
    if (!children || !Array.isArray(children)) {
      return;
    }

    const hasDefaultSelected = children?.some(
      (child) => child.props.defaultSelected
    );

    if (!hasDefaultSelected) {
      ignoreChangeRef.current = false;
    }
  }, [children]);

  return (
    <SegmentedControlContext.Provider value={{ selected, setSelected }}>
      <ul className={cn("flex flex-wrap items-center", className)} {...rest}>
        {children}
      </ul>
    </SegmentedControlContext.Provider>
  );
};

SegmentedControl.Button = SegmentedControlButton;
