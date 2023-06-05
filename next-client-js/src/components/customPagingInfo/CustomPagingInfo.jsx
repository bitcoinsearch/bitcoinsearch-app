import { PagingInfo } from "@elastic/react-search-ui";

import React from "react";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";
import CustomPagingInfoView from "./customPagingInfoView";

const CustomPagingInfo = () => {
  const { hiddenBody } = useIsInitialStateWithoutFilter();
  if (hiddenBody) {
    return null;
  }
  return <PagingInfo view={CustomPagingInfoView} />;
};

export default CustomPagingInfo;
