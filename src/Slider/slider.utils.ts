export const thumbSizeVariants = {
  2: "h-4 w-4 top-[50%] -translate-y-[6px]",
  3: "h-5 w-5 top-[50%] -translate-y-[10px]",
  4: "h-6 w-6 top-[50%] -translate-y-[14px]",
};

export const trackSizeVariants = {
  2: "h-2",
  3: "h-3",
  4: "h-4",
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