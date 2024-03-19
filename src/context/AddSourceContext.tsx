
import React, { createContext, useState } from "react";

export type AddSourceContextType = {
  openForm: () => void;
  closeForm: () => void;
  isOpen: boolean;
}

export const AddSourceContext = createContext<AddSourceContextType | null>(null);

export const AddSourceProvider = ({ children }: { children: React.ReactNode}) => {

  const [isOpen, setIsOpen] = useState(false)

  const openForm = () => {
    setIsOpen(true)
  }

  const closeForm = () => {
    setIsOpen(false)
  }

  return (
    <AddSourceContext.Provider value={{ openForm, closeForm, isOpen }} >
      {children}
    </AddSourceContext.Provider>
  );
};
