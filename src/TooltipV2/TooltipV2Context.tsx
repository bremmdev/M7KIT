import React from "react";

type TooltipContextType = {
    open: boolean;
    setOpen: (open: boolean) => void;
    hoverDelay: number;
    openTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
    closeTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
    triggerWidth: number;
    setTriggerWidth: (width: number) => void;
};

const TooltipContext = React.createContext<TooltipContextType | undefined>(
    undefined
);

export const useToolTip = () => {
    const context = React.useContext(TooltipContext);
    if (!context) {
        throw new Error(
            "useToolTip must be used within a ToolTipProvider"
        );
    }
    return context;
};

type ToolTipProviderProps = {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    hoverDelay: number;
};

export const ToolTipProvider = ({
    children,
    open: controlledOpen,
    onOpenChange,
    hoverDelay,
}: ToolTipProviderProps) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [triggerWidth, setTriggerWidth] = React.useState(0);
    const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Use controlled value if provided, otherwise use internal state
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (value: boolean) => {
        if (!isControlled) {
            setInternalOpen(value);
        }
        onOpenChange?.(value);
    };

    return (
        <TooltipContext.Provider value={{ open, setOpen, hoverDelay, openTimerRef, closeTimerRef, triggerWidth, setTriggerWidth }}>
            {children}
        </TooltipContext.Provider>
    );
};