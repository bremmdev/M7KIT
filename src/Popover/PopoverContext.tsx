"use client";

import React from "react";
import { OverlayProvider, useOverlay, OverlayContextType } from "../shared/Overlay/OverlayContext";

const PopoverContext = React.createContext<OverlayContextType | undefined>(undefined);

export const usePopover = () => {
    const context = React.useContext(PopoverContext);
    if (!context) {
        throw new Error("usePopover must be used within a PopoverProvider");
    }
    return context;
};

type PopoverProviderProps = {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    fade: boolean;
};

export const PopoverProvider = ({
    children,
    open: controlledOpen,
    onOpenChange,
    fade
}: PopoverProviderProps) => {
    return (
        <OverlayProvider open={controlledOpen} onOpenChange={onOpenChange} fade={fade}>
            <PopoverProviderInner>{children}</PopoverProviderInner>
        </OverlayProvider>
    );
};

type PopoverProviderInnerProps = {
    children: React.ReactNode;
};

const PopoverProviderInner = ({ children }: PopoverProviderInnerProps) => {
    const overlay = useOverlay();

    return <PopoverContext.Provider value={overlay}>{children}</PopoverContext.Provider>;
};
