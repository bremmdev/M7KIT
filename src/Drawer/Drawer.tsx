import React from "react";
import {
  DrawerProps,
  DrawerContentProps,
  DrawerTriggerProps,
} from "./Drawer.types";
import { cn } from "../utils/cn";
import { getPositionClasses, useDrawer, useDrawerEvents } from "./Drawer.utils";
import { DrawerProvider } from "./DrawerContext";
import { X } from "lucide-react";
import { usePreventScroll } from "../_hooks/usePreventScroll";

const DrawerClose = () => {
  const { onClose } = useDrawer();

  return (
    <div
      className={cn(
        "sticky left-0 right-0 py-3 pr-6 top-0 flex bg-inherit items-center justify-end"
      )}
    >
      <button
        className="focus-ring-inner hover:bg-clr-accent/10 rounded-md transition-colors p-1"
        onClick={onClose}
        aria-label="close drawer"
      >
        <X className="size-7 stroke-clr-text" />
      </button>
    </div>
  );
};

export const DrawerTrigger = (props: DrawerTriggerProps) => {
  const { children, className, hideTriggerWhenOpen = false, ...rest } = props;
  const { onOpen, isOpen } = useDrawer();

  return isOpen && hideTriggerWhenOpen ? null : (
    <button className={cn("", className)} onClick={onOpen} {...rest}>
      {children}
    </button>
  )
};

export const DrawerContent = (props: DrawerContentProps) => {
  const { children, className } = props;

  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
};

export const Drawer = (props: DrawerProps) => {
  const { children, className, placement = "right", ...rest } = props;

  const { drawerRef, isOpen } = useDrawer();

  useDrawerEvents();
  usePreventScroll({
    enabled: isOpen,
  });

  React.useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.scrollTop = 0;
      drawerRef.current.focus();
    }
  }, [isOpen, drawerRef]);

  return (
    <dialog
      className={cn(
        `${getPositionClasses(placement)} fixed backdrop:bg-black/70 focus-visible:outline-none focus:outline-none bg-clr-bg-surface`,
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

export const DrawerRoot = ({
  children,
}: {
  children: Array<React.ReactElement>;
}) => {
  return (
    <DrawerProvider>
      <>{children}</>
    </DrawerProvider>
  );
};
