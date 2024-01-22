import React from "react";
import { SliderPropsType } from "./Slider.types";

interface SliderContext extends Required<SliderPropsType> {
  currentValue: number | undefined;
}

export const SliderContext = React.createContext<SliderContext | null>(null);

export const useSliderContext = () => {
  const context = React.useContext(SliderContext);
  if (!context) {
    throw new Error(
      "Slider compound components cannot be rendered outside the Slider component"
    );
  }
  return context;
};
