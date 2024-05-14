import { PageScrollIndicatorProps } from "./PageScrollIndicator.types";
import { cn } from "../utils/cn";
import useScrollPosition from "../utils/hooks/useScrollPosition";

export const PageScrollIndicator = (props: PageScrollIndicatorProps) => {
  const { className, ...rest } = props;

  const { scrollPercent } = useScrollPosition();

  const style = {
    transform: `translateX(${scrollPercent - 100}%)`,
  };

  return (
    <div
      style={style}
      className={cn("fixed left-0 top-0 w-screen h-1 bg-slate-900 dark:bg-slate-50", className)}
      {...rest}
    />
  );
};
