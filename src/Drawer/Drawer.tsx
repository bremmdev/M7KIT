import React from "react";
import { DrawerProps, DrawerContentProps, DrawerTriggerProps } from "./Drawer.types";
import { cn } from "../utils/cn";
import { getPositionClasses, useDrawer, useDrawerEvents } from "./Drawer.utils";
import { DrawerProvider } from "./DrawerContext";
import { X } from "lucide-react";
import { usePreventScroll } from "../_hooks/usePreventScroll";
import { useFocusTrap } from "../_hooks/useFocusTrap";
import { ensureLiveRegion } from "../Announcer/Announcer";

const DrawerClose = () => {
  const { close } = useDrawer();

  return (
    <div className={cn("sticky left-0 right-0 py-3 pr-6 top-0 flex bg-inherit items-center justify-end")}>
      <button
        type="button"
        className="group focus-ring-inner hover:bg-surface-muted rounded-md transition-colors p-1"
        onClick={close}
        aria-label="close drawer"
      >
        {/* The explicit stroke is kept in forced colors (Windows high contrast) and could vanish against the forced background.
            The hover background is replaced there, so hover turns the icon Highlight instead */}
        <X className="size-7 stroke-foreground forced-colors:stroke-[ButtonText] forced-colors:group-hover:stroke-[Highlight]" />
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
      // The page behind the modal is inert, so announcements go to live regions inside the drawer.
      // Create them as it opens: screen readers can miss a message in a region that was only just added
      ensureLiveRegion(drawerRef.current);

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

  // Forced colors (Windows high contrast) replace the surface and the backdrop with Canvas, so the drawer gets a border there to show its edge.
  // outline-hidden still draws a transparent outline there, which is made visible, so it gets the Highlight focus color
  return (
    <dialog
      className={cn(
        `${getPositionClasses(
          placement
        )} fixed backdrop:bg-black/70 focus-visible:outline-hidden focus:outline-hidden forced-colors:focus:outline-[Highlight] bg-surface forced-colors:border`,
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
      {/* biome-ignore lint/complexity/noUselessFragments: DrawerProvider takes a single element, not an array */}
      <>{children}</>
    </DrawerProvider>
  );
};
