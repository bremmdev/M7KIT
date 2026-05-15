import { ThemeToggleSize } from "./ThemeToggle.types";

export const getThemeToggleSizeClasses = (size: ThemeToggleSize) => {
    switch (size) {
        case "sm":
            return "h-8 w-16";
        case "lg":
            return "h-10 w-20";
    }
};

export const getThemeToggleThumbSizeClasses = (size: ThemeToggleSize) => {
    switch (size) {
        case "sm":
            return "w-6 h-6";
        case "lg":
            return "w-8 h-8";
    }
};

export const getThemeToggleTrackStyleClasses = (blackAndWhite: boolean, checked: boolean) => {
    if (blackAndWhite && !checked) {
        return "bg-surface-strong peer-focus-visible:outline-foreground ";
    } else if (blackAndWhite && checked) {
        return "bg-foreground outline-foreground";
    } else if (!blackAndWhite && !checked) {
        return "bg-blue-800 outline-blue-800";
    } else if (!blackAndWhite && checked) {
        return "bg-blue-500 outline-blue-500";
    }
};

export const getThemeToggleThumbStyleClasses = (blackAndWhite: boolean, checked: boolean) => {
    if (blackAndWhite && checked) {
        return "bg-foreground-inverse";
    } else if (blackAndWhite && !checked) {
        return "bg-foreground";
    }
    else if (!blackAndWhite && !checked) {
        return "bg-slate-200";
    } else if (!blackAndWhite && checked) {
        return "bg-amber-400";
    }
};

export const getThemeToggleTrackIconClasses = (size: ThemeToggleSize, isChecked: boolean) => {
    const positionClasses = isChecked ? "left-1 absolute top-1/2 -translate-y-1/2" : "right-1 absolute top-1/2 -translate-y-1/2";

    switch (size) {
        case "sm":
            return `${positionClasses} w-5 h-5`;
        case "lg":
            return `${positionClasses} w-7 h-7`;
    }
};

/** Decorative track icons for the theme toggle, a cluster of Stars or Clouds */
export const getThemeToggleTrackClusterClasses = (size: ThemeToggleSize, isChecked: boolean, blackAndWhite: boolean) => {
    const baseClassesNotChecked = {
        container: "pointer-events-none absolute inset-y-0 left-[50%] right-0",
        top: `absolute left-0 top-1 size-3 ${blackAndWhite ? "stroke-foreground" : "stroke-amber-300"} fill-none`,
        right: `absolute right-1 top-[40%] size-3 -translate-y-1/2 ${blackAndWhite ? "stroke-foreground" : "stroke-amber-300"} fill-none`,
        bottom: `absolute bottom-1 left-2 size-3 ${blackAndWhite ? "stroke-foreground" : "stroke-amber-300"} fill-none`,
    }

    const baseClassesChecked = {
        container: "pointer-events-none absolute inset-y-0 left-0 right-[50%]",
        top: `absolute left-1 top-1 size-3 ${blackAndWhite ? "stroke-foreground-inverse" : "stroke-white"} fill-none`,
        right: `absolute right-0 top-[40%] size-3 -translate-y-1/2 ${blackAndWhite ? "stroke-foreground-inverse" : "stroke-white"} fill-none`,
        bottom: `absolute bottom-1 left-3 size-3 ${blackAndWhite ? "stroke-foreground-inverse" : "stroke-white"} fill-none`,
    }

    if (isChecked) {
        return {
            ...baseClassesChecked,
            top: `${baseClassesChecked.top} size-${size === "sm" ? "3" : "4"}`,
            right: `${baseClassesChecked.right} size-${size === "sm" ? "3" : "4"}`,
            bottom: `${baseClassesChecked.bottom} size-${size === "sm" ? "3" : "4"}`,
        };
    } else {
        return {
            ...baseClassesNotChecked,
            top: `${baseClassesNotChecked.top} size-${size === "sm" ? "3" : "4"}`,
            right: `${baseClassesNotChecked.right} size-${size === "sm" ? "3" : "4"}`,
            bottom: `${baseClassesNotChecked.bottom} size-${size === "sm" ? "3" : "4"}`,
        };
    }
};