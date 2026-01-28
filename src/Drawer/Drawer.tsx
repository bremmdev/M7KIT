import React from "react";
import { DrawerProps, DrawerContentProps, DrawerTriggerProps } from "./Drawer.types";
import { cn } from "../utils/cn";
import { getPositionClasses, useDrawer, useDrawerEvents } from "./Drawer.utils";
import { DrawerProvider } from "./DrawerContext";
import { X } from "lucide-react";
import { usePreventScroll } from "../_hooks/usePreventScroll";
import { useFocusTrap } from "../_hooks/useFocusTrap";

const DrawerClose = () => {
  const { close } = useDrawer();

  return (
    <div className={cn("sticky left-0 right-0 py-3 pr-6 top-0 flex bg-inherit items-center justify-end")}>
      <button
        className="focus-ring-inner hover:bg-surface-muted rounded-md transition-colors p-1"
        onClick={close}
        aria-label="close drawer"
      >
        <X className="size-7 stroke-foreground" />
      </button>
    </div>
  );
};

export const DrawerTrigger = (props: DrawerTriggerProps) => {
  const { children, className, hideTriggerWhenOpen = false, ...rest } = props;
  const { open, isOpen, triggerRef } = useDrawer();

  return isOpen && hideTriggerWhenOpen ? null : (
    <button className={cn("", className)} onClick={open} {...rest} ref={triggerRef}>
      {children}
    </button>
  );
};

export const DrawerContent = (props: DrawerContentProps) => {
  const { children, className } = props;

  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
};

export const Drawer = (props: DrawerProps) => {
  const { children, className, onClose, onOpen, placement = "right", resetScroll = true, ...rest } = props;

  const { drawerRef, isOpen } = useDrawer();
  const firstMountRef = React.useRef(true);

  useDrawerEvents();
  usePreventScroll({
    enabled: isOpen
  });
  useFocusTrap(drawerRef, {
    condition: isOpen,
    initialFocusElement: "container"
  });

  React.useEffect(() => {
    if (isOpen && drawerRef.current) {
      // Reset scroll position when the drawer is opened
      if (resetScroll) {
        drawerRef.current.scrollTop = 0;
      }
      // drawerRef.current.focus();
    }
  }, [isOpen, drawerRef, resetScroll]);

  React.useEffect(() => {
    if (firstMountRef.current) return;
    if (isOpen && onOpen) {
      onOpen();
    }
    if (!isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onOpen, onClose]);

  React.useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }
  }, [isOpen]);

  return (
    <dialog
      className={cn(
        `${getPositionClasses(
          placement
        )} fixed backdrop:bg-black/70 focus-visible:outline-hidden focus:outline-hidden bg-surface`,
        className
      )}
      ref={drawerRef}
      {...rest}
    >
      <div className="relative bg-inherit">
        <DrawerClose />
        {children}
      </div>
    </dialog>
  );
};

export const DrawerRoot = ({ children }: { children: Array<React.ReactElement<any>> }) => {
  return (
    <DrawerProvider>
      <>{children}</>
    </DrawerProvider>
  );
};
