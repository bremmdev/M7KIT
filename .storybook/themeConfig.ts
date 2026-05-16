export const primaryColors = {
  pink: {
    light: "oklch(59.2% 0.249 0.584)",
    dark: "oklch(79.2% 0.249 0.584)",
    icon: "🩷"
  },
  red: {
    light: "oklch(57.7% 0.245 27.325)",
    dark: "oklch(77.7% 0.245 27.325)",
    icon: "🔴"
  },
  orange: {
    light: "oklch(64.6% 0.222 41.116)",
    dark: "oklch(84.6% 0.222 41.116)",
    icon: "🟠"
  },
  emerald: {
    light: "oklch(59.6% 0.145 163.225)",
    dark: "oklch(79.6% 0.145 163.225)",
    icon: "🟢"
  },
  blue: {
    light: "oklch(54.6% 0.245 262.881)",
    dark: "oklch(74.6% 0.245 262.881)",
    icon: "🔵"
  },
  violet: {
    light: "oklch(54.1% 0.281 293.009)",
    dark: "oklch(74.1% 0.281 293.009)",
    icon: "🟣"
  },
  fuchsia: {
    light: "oklch(59.1% 0.293 322.896)",
    dark: "oklch(79.1% 0.293 322.896)",
    icon: "🩷"
  }
} as const;

export type PrimaryColorKey = keyof typeof primaryColors;
