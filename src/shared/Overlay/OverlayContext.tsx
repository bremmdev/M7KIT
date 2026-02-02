"use client";

import React from "react";

export type OverlayContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  fade: boolean;
  closeTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
  triggerWidth: number;
  setTriggerWidth: (width: number) => void;
  overlayId: string;
  triggerId: string;
  overlayTriggerRef: React.RefObject<HTMLButtonElement>;
  overlayContentRef: React.RefObject<HTMLDivElement>;
};

const OverlayContext = React.createContext<OverlayContextType | undefined>(undefined);

export const useOverlay = () => {
  const context = React.useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider such as TooltipProvider or PopoverProvider");
  }
  return context;
};

type OverlayProviderProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  fade: boolean;
};

export const OverlayProvider = ({
  children,
  open: controlledOpen,
  onOpenChange,
  fade
}: OverlayProviderProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayTriggerRef = React.useRef<HTMLButtonElement | null>(null);
  const overlayContentRef = React.useRef<HTMLDivElement | null>(null);

  // Reusable ids for aria
  const overlayId = React.useId();
  const triggerId = React.useId();

  // Use controlled value if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const contextValue: OverlayContextType = {
    open,
    setOpen,
    fade: fade ?? true,
    closeTimerRef,
    triggerWidth,
    setTriggerWidth,
    overlayId,
    triggerId,
    overlayTriggerRef: overlayTriggerRef as React.RefObject<HTMLButtonElement>,
    overlayContentRef: overlayContentRef as React.RefObject<HTMLDivElement>,
  };

  return <OverlayContext.Provider value={contextValue}>{children}</OverlayContext.Provider>;
};
