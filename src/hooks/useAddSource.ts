import { useContext } from "react";
import { AddSourceContext } from "../context/AddSourceContext";

const useAddSources = () => {
  return useContext(AddSourceContext);
};

export default useAddSources;
