import React from "react";
import { Paging } from "@elastic/react-search-ui-views";
import useSearchQuery from "../../hooks/useSearchQuery";

const BodyFooter = () => {
  const { handlePageChange, pagingInfo } = useSearchQuery();
  const { totalResults, current, resultsPerPage } = pagingInfo;
  if (!totalResults) {
    return null;
  }
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  return (
    <div className="footer-container">
      <Paging
        onChange={handlePageChange}
        totalPages={totalPages}
        current={current}
        resultsPerPage={resultsPerPage}
      />
    </div>
  );
};

export default BodyFooter;
