import { useContext } from "react";
import { UIContext } from "../context/UIContext";

const useUIContext = () => {
  return useContext(UIContext);
};

export default useUIContext;
