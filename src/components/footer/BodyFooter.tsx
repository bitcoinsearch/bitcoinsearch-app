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
      <a
        href="https://bitcoindevs.xyz/"
        target="_blank"
        rel="noreferrer"
        className="chaincode-link"
      >
        ❤️ Bitcoin Dev Project
      </a>

      <div className="umami">
        <p>
          Visitor counts publicly available via{" "}
          <a
            href="https://visits.bitcoindevs.xyz/share/0Beh7BUzocqrtgA5/bitcoin-search"
            target="_blank"
            rel="noreferrer"
            className="chaincode-link"
          >
            umami
          </a>
        </p>
      </div>
    </div>
  );
};

export default BodyFooter;
