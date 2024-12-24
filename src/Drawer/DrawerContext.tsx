import React from "react";

type DrawerContext = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  drawerRef: React.RefObject<HTMLDialogElement>;
  triggerRef: React.RefObject<HTMLButtonElement>;
};

export const DrawerContext = React.createContext<DrawerContext | undefined>(
  undefined
);

export const DrawerProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const drawerRef = React.useRef<HTMLDialogElement>(null) as React.RefObject<HTMLDialogElement>;
  const triggerRef = React.useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>;

  function open() {
    setIsOpen(true);
    drawerRef.current?.showModal();
  }
  function close() {
    setIsOpen(false);
    drawerRef.current?.close();
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 0);
  }

  return (
    <DrawerContext.Provider
      value={{ isOpen, open, close, drawerRef, triggerRef }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
