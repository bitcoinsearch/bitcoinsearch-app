import React from "react";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";
import useSearchQuery from "../../hooks/useSearchQuery";

const CustomPagingInfo = () => {
  const { hiddenBody } = useIsInitialStateWithoutFilter();
  const { pagingInfo } = useSearchQuery();
  if (hiddenBody) {
    return null;
  }
  const { totalResults } = pagingInfo;
  return (
    <div className="sui-layout-main-header__inner">
      <div className="paging-info">
        <strong>{totalResults}</strong>
        <p>results</p>
      </div>
    </div>
  );
};

export default CustomPagingInfo;
