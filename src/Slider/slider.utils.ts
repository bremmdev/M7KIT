export const thumbSizeVariants = {
  horizontal: {
  2: "h-4 w-4 top-[50%] -translate-y-[6px]",
  3: "h-5 w-5 top-[50%] -translate-y-[10px]",
  4: "h-6 w-6 top-[50%] -translate-y-[14px]",
  },
  vertical: {
  2: "h-4 w-4 left-[50%] -translate-x-[4px]",
  3: "h-5 w-5 left-[50%] -translate-x-[4px]",
  4: "h-6 w-6 left-[50%] -translate-x-[4px]",
  }
};

export const trackSizeVariants = {
  horizontal: {
    2: "h-2 w-full",
    3: "h-3 w-full",
    4: "h-4 w-full",
  },
  vertical: {
    2: "w-2 h-full",
    3: "w-3 h-full",
    4: "w-4 h-full",
  },
};

export const determineDefaultValue = (
  value: number | undefined,
  max: number,
  min: number
) => {
  if (value === undefined) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};
