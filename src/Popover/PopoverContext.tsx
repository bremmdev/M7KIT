"use client";

import React from "react";
import { OverlayProvider, useOverlay, OverlayContextType } from "../shared/Overlay/OverlayContext";

type PopoverContextType = OverlayContextType & {
    trapFocus: boolean;
    hasTitleRendered: boolean;
    setHasTitleRendered: (value: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

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
    trapFocus: boolean;
};

export const PopoverProvider = ({
    children,
    open: controlledOpen,
    onOpenChange,
    fade,
    trapFocus = false,
}: PopoverProviderProps) => {
    return (
        <OverlayProvider open={controlledOpen} onOpenChange={onOpenChange} fade={fade}>
            <PopoverProviderInner trapFocus={trapFocus}>{children}</PopoverProviderInner>
        </OverlayProvider>
    );
};

type PopoverProviderInnerProps = {
    children: React.ReactNode;
    trapFocus: boolean;
};

const PopoverProviderInner = ({ children, trapFocus }: PopoverProviderInnerProps) => {
    const overlay = useOverlay();
    const [hasTitleRendered, setHasTitleRendered] = React.useState(false);

    const contextValue: PopoverContextType = {
        ...overlay,
        trapFocus,
        hasTitleRendered,
        setHasTitleRendered,
    };

    return <PopoverContext.Provider value={contextValue}>{children}</PopoverContext.Provider>;
};
