import { cn } from "../utils/cn";
import { ImageShowcaseProps } from "./ImageShowcase.types";

export const ImageShowcase = (props: ImageShowcaseProps) => {
  const { children, className, growFactor = 2, ...rest } = props;

  if (!Array.isArray(children)) {
    throw new Error("ImageShowcase component expects children to be an array of items");
  }

  const flexGrow = {
    1.5: "hover:flex-[1.5]",
    2: "hover:flex-2",
    2.5: "hover:flex-[2.5]",
    3: "hover:flex-3"
  }[growFactor];

  return (
    <div className={cn("w-full p-4 flex gap-2 h-80 showcase", className)} {...rest}>
      {children.map((child, idx) => (
        <div
          className={`min-w-0 flex-1 *:rounded-md  *:w-full *:h-full *:object-cover ${flexGrow} transition-all duration-500`}
          key={idx}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
