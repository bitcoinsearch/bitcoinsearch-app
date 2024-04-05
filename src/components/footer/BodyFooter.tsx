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
     <Paging
        onChange={handlePageChange}
        totalPages={totalPages}
        current={current}
        resultsPerPage={resultsPerPage}
      />
      <HolocatChatBtc />
    </div>
  );
};

export default BodyFooter;
