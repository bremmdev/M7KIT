import { ShimmerImageProps } from "./ShimmerImage.types";
import { cn } from "../utils/cn";

export const ShimmerImage = (props: ShimmerImageProps) => {
  const { className, rounded = false, src, ...rest } = props;

  return (
    <div
      className={cn(
        "relative w-fit after:absolute after:inset-0 after:content-[''] after:bg-shimmer after:bg-size-[200%] after:animate-shimmer",
        {
          "after:rounded-full": rounded,
        }
      )}
    >
      <img
        src={src}
        className={cn(
          "",
          {
            "rounded-full object-cover aspect-square": rounded,
          },
          className
        )}
        {...rest}
      />
    </div>
  );
};
