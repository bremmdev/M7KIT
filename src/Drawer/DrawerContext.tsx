import React from "react";

type DrawerContext = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  drawerRef: React.RefObject<HTMLDialogElement>;
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
  const drawerRef = React.useRef<HTMLDialogElement>(null);

  function onOpen() {
    setIsOpen(true);
    drawerRef.current?.showModal();
  }
  function onClose() {
    setIsOpen(false);
    drawerRef.current?.close();
  }

  return (
    <DrawerContext.Provider value={{ isOpen, onOpen, onClose, drawerRef }}>
      {children}
    </DrawerContext.Provider>
  );
};
