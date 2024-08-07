import React from "react";

type LineClampContextType = {
  clamped: boolean;
  setClamped: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LineClampContext = React.createContext<LineClampContextType | undefined>(
  undefined
);

export const LineClampProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [clamped, setClamped] = React.useState(true);

  return (
    <LineClampContext.Provider value={{ clamped, setClamped }}>
      {children}
    </LineClampContext.Provider>
  );
};
