import { Paging } from "@elastic/react-search-ui";
import React from "react";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";
import "./footer.scss";

const Footer = () => {
  const { hiddenBody } = useIsInitialStateWithoutFilter();
  if (hiddenBody) {
    return null;
  }
  return (
    <div className="footer-container">
      <Paging />
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
