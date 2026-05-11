import { SwitchSize } from "./Switch.types";

export const getSwitchSizeClasses = (size: SwitchSize) => {
    switch (size) {
        case "sm":
            return "h-5 w-10";
        case "md":
            return "h-6 w-12";
        case "lg":
            return "h-7 w-14";
    }
};

export const getSwitchThumbSizeClasses = (size: SwitchSize) => {
    switch (size) {
        case "sm":
            return "w-4 h-4";
        case "md":
            return "w-5 h-5";
        case "lg":
            return "w-6 h-6";
    }
};