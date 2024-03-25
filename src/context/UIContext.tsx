
import React, { createContext, useState } from "react";

export type UIContextType = {
  openForm: () => void;
  closeForm: () => void;
  isOpen: boolean;
  sidebarToggleManager: {
    state: boolean;
    updater: (x?:boolean) => void;
  }
}

export const UIContext = createContext<UIContextType | null>(null);

export const UIContextProvider = ({ children }: { children: React.ReactNode}) => {

  const [isOpen, setIsOpen] = useState(false);

  const [isSBToggleOpen, setIsSBToggleOpen] = useState(false)

  const openForm = () => {
    setIsOpen(true)
  }

  const closeForm = () => {
    setIsOpen(false)
  }

  const toggleSB = (SBControlBool?: boolean) => {
    if (SBControlBool !== undefined) {
      setIsSBToggleOpen(SBControlBool)
      return
    }
    setIsSBToggleOpen(prev => !prev)
  }

  const sidebarToggleManager = {
    state: isSBToggleOpen,
    updater: toggleSB
  }

  return (
    <UIContext.Provider value={{ openForm, closeForm, isOpen, sidebarToggleManager }} >
      {children}
    </UIContext.Provider>
  );
};
