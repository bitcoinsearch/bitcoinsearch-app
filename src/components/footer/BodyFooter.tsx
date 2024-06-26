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
      <div className="flex w-full max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        {current !== 1 && (
          <button
            className="rc-pagination-jump-prev"
            onClick={() => handlePageChange(1)}
            aria-label="jump to first page"
          />
        )}
        <Paging
          onChange={handlePageChange}
          totalPages={totalPages}
          current={current}
          resultsPerPage={resultsPerPage}
          className="flex justify-between"
        />
        {current !== totalPages && (
          <button
            className="rc-pagination-jump-next"
            onClick={() => handlePageChange(totalPages)}
            aria-label="jump to last page"
          />
        )}
      </div>

      <HolocatChatBtc />
    </div>
  );
};

export default BodyFooter;
