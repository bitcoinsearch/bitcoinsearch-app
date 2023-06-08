// import { Paging } from "@elastic/react-search-ui";
import React from "react";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";
import { Paging } from "@elastic/react-search-ui-views";
import useSearchQuery from "../../hooks/useSearchQuery";
import { useRouter } from "next/router";

const Footer = () => {
  // const page = useRouter().query.get["page"]
  const { handlePageChange, pagingInfo } = useSearchQuery();
  const { totalResults, current, resultsPerPage } = pagingInfo;
  // const { hiddenBody } = useIsInitialStateWithoutFilter();
  if (!totalResults) {
    return null;
  }
  const totalPages = Math.round(totalResults/resultsPerPage)
  console.log({pagingInfo, totalPages})
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
