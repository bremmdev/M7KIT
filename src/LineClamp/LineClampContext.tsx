import React from "react";

type LineClampContextType = {
  clamped: boolean;
  setClamped: React.Dispatch<React.SetStateAction<boolean>>;
  hideTrigger: boolean;
  setHideTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LineClampContext = React.createContext<LineClampContextType | undefined>(
  undefined
);

export const LineClampProvider = ({
  children,
}: {
  children: React.ReactElement<any>;
}) => {
  const [clamped, setClamped] = React.useState(true);
  const [hideTrigger, setHideTrigger] = React.useState(false);

  return (
    <LineClampContext.Provider value={{ clamped, setClamped, hideTrigger, setHideTrigger }}>
      {children}
    </LineClampContext.Provider>
  );
};
