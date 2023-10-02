import React from "react";
import { Paging } from "@elastic/react-search-ui-views";
import useSearchQuery from "../../hooks/useSearchQuery";

const Footer = () => {
  const { handlePageChange, pagingInfo } = useSearchQuery();
  const { totalResults, current, resultsPerPage } = pagingInfo;
  if (!totalResults) {
    return null;
  }
  const totalPages = Math.ceil(totalResults/resultsPerPage)
  return (
    <div className="footer-container">
      <Paging onChange={handlePageChange} totalPages={totalPages} current={current} resultsPerPage={resultsPerPage}   />
      <a
        href="https://chaincode.com"
        target="_blank"
        rel="noreferrer"
        className="chaincode-link"
      >
        ❤️ Chaincode
      </a>
    </div>
  );
};

export default Footer;
