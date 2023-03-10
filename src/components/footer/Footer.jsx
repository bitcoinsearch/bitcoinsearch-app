import { Paging } from "@elastic/react-search-ui";
import React from "react";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";

const Footer = () => {
  const { hiddenBody } = useIsInitialStateWithoutFilter();
  if (hiddenBody) {
    return null;
  }
  return <Paging />;
};

export default Footer;
