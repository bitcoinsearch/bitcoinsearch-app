import React from "react";
import { Paging } from "@elastic/react-search-ui-views";
import useSearchQuery from "../../hooks/useSearchQuery";
import CustomPagination from "./CustomPagination";

const BodyFooter = () => {
  const { handlePageChange, pagingInfo } = useSearchQuery();
  const { totalResults, current, resultsPerPage } = pagingInfo;
  if (!totalResults) {
    return null;
  }
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  return (
    <div className="footer-container p-4 flex items-center justify-center">
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
