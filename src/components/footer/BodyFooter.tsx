import React from "react";
import { Paging } from "@elastic/react-search-ui-views";
import useSearchQuery from "../../hooks/useSearchQuery";
import HolocatChatBtc from "./HolocatChatBtc";

const BodyFooter = () => {
  const { handlePageChange, pagingInfo } = useSearchQuery();
  const { totalResults, current, resultsPerPage } = pagingInfo;
  if (!totalResults) {
    return null;
  }
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  return (
    <div className="footer-container py-2 xl:p-4 gap-8 xl:gap-20 flex flex-col items-start justify-center max-w-full overflow-hidden">
      <div className="flex">
        {current !== 1 && (
          <button
            className="rc-pagination-jump-prev"
            onClick={() => handlePageChange(1)}
          ></button>
        )}
        <Paging
          onChange={handlePageChange}
          totalPages={totalPages}
          current={current}
          resultsPerPage={resultsPerPage}
        />
        {current !== totalPages && (
          <button
            className="rc-pagination-jump-next"
            onClick={() => handlePageChange(totalPages)}
          ></button>
        )}
      </div>

      <HolocatChatBtc />
    </div>
  );
};

export default BodyFooter;
