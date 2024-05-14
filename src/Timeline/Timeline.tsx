import { TimelineProps, TimelineItemProps } from "./Timeline.types";
import { cn } from "../utils/cn";

const Bullet = ({ bullet }: { bullet: TimelineItemProps["bullet"] }) => {
  return (
    <div className="absolute left-[50%] -translate-x-[50%] bg-white inline-block py-[2px]">
      {bullet ? (
        bullet
      ) : (
        <div className="w-5 h-5 border-2 border-slate-300 rounded-full bg-white" />
      )}
    </div>
  );
};

const TimelineLine = ({
  bullet,
  className,
}: {
  bullet: TimelineItemProps["bullet"];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute -left-6 top-0 w-1 h-full bg-slate-300",
        className
      )}
    >
      <Bullet bullet={bullet} />
    </div>
  );
};

const TimelineItem = (props: TimelineItemProps) => {
  const { children, bullet, lineClassName, className, ...rest } =
    props;

  return (
    <article
      className={cn("relative flex flex-col gap-2 pb-4", className)}
      {...rest}
    >
      <TimelineLine bullet={bullet} className={lineClassName} />
      {children}
    </article>
  );
};

export const Timeline = (props: TimelineProps) => {
  const { children, className, ...rest } = props;

  return (
    <section className={cn("", className)} {...rest}>
      {children}
    </section>
  );
};

Timeline.Item = TimelineItem;
