"use client";

import React from "react";
import { OverlayProvider, useOverlay, OverlayContextType } from "../shared/Overlay/OverlayContext";

type TooltipContextType = OverlayContextType & {
  hoverDelay: number;
  touchBehavior: "tap" | "longPress" | "off";
  openTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
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
  touchBehavior: "tap" | "off";
};

export const TooltipProvider = ({
  children,
  open: controlledOpen,
  onOpenChange,
  hoverDelay,
  fade,
  touchBehavior
}: TooltipProviderProps) => {
  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <OverlayProvider open={controlledOpen} onOpenChange={onOpenChange} fade={fade}>
      <TooltipProviderInner hoverDelay={hoverDelay} touchBehavior={touchBehavior} openTimerRef={openTimerRef}>
        {children}
      </TooltipProviderInner>
    </OverlayProvider>
  );
};

type TooltipProviderInnerProps = {
  children: React.ReactNode;
  hoverDelay: number;
  touchBehavior: "tap" | "off";
  openTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
};

const TooltipProviderInner = ({
  children,
  hoverDelay,
  touchBehavior,
  openTimerRef
}: TooltipProviderInnerProps) => {
  const overlay = useOverlay();

  const contextValue: TooltipContextType = {
    ...overlay,
    hoverDelay,
    touchBehavior,
    openTimerRef
  };

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
};
