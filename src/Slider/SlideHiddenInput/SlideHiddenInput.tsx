import { useSliderContext } from "../slide-context";

export const SlideHiddenInput = () => {
  const { name, currentValue } = useSliderContext();

  if (!name) return null;
  return (
    <input
      type="text"
      className="hidden"
      name={name}
      value={currentValue}
      readOnly
    />
  );
};