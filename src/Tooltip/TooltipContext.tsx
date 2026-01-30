"use client";

import React from "react";

type TooltipContextType = {
  fade: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  hoverDelay: number;
  touchBehavior: "tap" | "longPress" | "off";
  openTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
  closeTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
  triggerWidth: number;
  setTriggerWidth: (width: number) => void;
  tooltipId: string;
  tooltipTriggerRef: React.RefObject<HTMLButtonElement>;
  tooltipContentRef: React.RefObject<HTMLDivElement>;
};

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

export const useTooltip = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
};

type TooltipProviderProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hoverDelay: number;
  fade: boolean;
  touchBehavior: "tap" | "longPress" | "off";
};

export const TooltipProvider = ({
  children,
  open: controlledOpen,
  onOpenChange,
  hoverDelay,
  fade,
  touchBehavior
}: TooltipProviderProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const tooltipContentRef = React.useRef<HTMLDivElement | null>(null);

  // Reusable tooltip id for aria-describedby
  const tooltipId = React.useId();

  // Use controlled value if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const contextValue: TooltipContextType = {
    open,
    setOpen,
    hoverDelay,
    fade: fade ?? true,
    touchBehavior,
    openTimerRef,
    closeTimerRef,
    triggerWidth,
    setTriggerWidth,
    tooltipId,
    tooltipTriggerRef: tooltipTriggerRef as React.RefObject<HTMLButtonElement>,
    tooltipContentRef: tooltipContentRef as React.RefObject<HTMLDivElement>
  };

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
};
