import { SearchContext } from "@elastic/react-search-ui";
import { useContext } from "react";

const useSearchContext = () => {
  return useContext(SearchContext).driver;
};

export default useSearchContext;
