import { GalleryStackProps, NavigationButtonProps } from "./Gallery.types";
import { cn } from "../utils/cn";
import React from "react";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { animationDirection } from "./Gallery.types";

const NavigationButtons = (props: NavigationButtonProps) => {
  const { animationDirection, className, onNavigate, lastItemIdx } = props;

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-[100%] -bottom-2",
        className
      )}
    >
      <button
        className="mx-auto rounded-full p-1 hover:bg-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:bg-transparent"
        disabled={animationDirection !== "idle"}
        aria-label="previous item"
        onClick={() => onNavigate(0)}
      >
        <CircleArrowLeft size={32} className="stroke-slate-500" />
      </button>
      <button
        className="mx-auto rounded-full p-1 hover:bg-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:bg-transparent"
        disabled={animationDirection !== "idle"}
        aria-label="next item"
        onClick={() => onNavigate(lastItemIdx)}
      >
        <CircleArrowRight size={32} className="stroke-slate-500 " />
      </button>
    </div>
  );
};

export const GalleryStack = (props: GalleryStackProps) => {
  const {
    children,
    className,
    rotationAmount = 3,
    reversed = false,
    animationDuration = 2000,
    ...rest
  } = props;

  //if children is not an array, throw an error
  if (!Array.isArray(children)) {
    throw new Error(
      "GalleryStack component expects children to be an array of items"
    );
  }

  //convert children iterable to array for easier manipulation and reverse if needed
  const childrenArray = React.Children.toArray(children);

  const [items, setItems] = React.useState<Array<React.ReactNode>>(
    reversed ? childrenArray.reverse() : childrenArray
  );
  const [animationDirection, setAnimationDirection] =
    React.useState<animationDirection>("idle");

  const handleItemClick = (idx: number) => {
    const itemsCopy = [...items];
    const clickedItem = itemsCopy.splice(idx, 1)[0];
    //if we go back move bottom item (index 0) to the top
    //otherwise move top item (index length-1) to the bottom
    const newItems =
      idx === 0
        ? [...items.slice(1), clickedItem]
        : [clickedItem, ...items.slice(0, -1)];

    setAnimationDirection(idx === 0 ? "backward" : "forward");
    //wait for the animation to finish before updating the items
    setTimeout(() => {
      setAnimationDirection("idle");
      setItems(newItems);
    }, animationDuration);
  };

  return (
    <div
      className={cn(
        "grid place-items-center place-content-center [&>*]:[grid-column:1] [&>*]:[grid-row:1] cursor-pointer p-16 w-fit relative z-10",
        className
      )}
      data-testid="gallery-stack"
      {...rest}
    >
      {items.map((child, idx) => {
        const isAnimating =
          (animationDirection === "forward" && idx === items.length - 1) ||
          (animationDirection === "backward" && idx === 0);
        const calculatedRotation = (items.length - idx - 1) * rotationAmount;
        const styles = isAnimating
          ? {
              animation: `${animationDuration}ms ${animationDirection === "forward" ? "slideAndBack" : "slideAndBackMirrored"} ease-in-out`,
            }
          : {
              transform: `rotate(${calculatedRotation}deg) translateX(0)`,
              zIndex: animationDirection ==="backward" ? - 1 : 0
            };
        return (
          <div
            key={idx}
            onClick={handleItemClick.bind(null, idx)}
            style={styles}
          >
            {child}
          </div>
        );
      })}
      <NavigationButtons
        onNavigate={handleItemClick}
        animationDirection={animationDirection}
        lastItemIdx={items.length - 1}
      />
    </div>
  );
};
