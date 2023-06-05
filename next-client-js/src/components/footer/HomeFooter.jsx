import React from "react";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";
import "./footer.scss";

const HomeFooter = () => {
  const { hiddenBody } = useIsInitialStateWithoutFilter();
  if (!hiddenBody) {
    return null;
  }
  return (
    <div className="home-footer">
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

export default HomeFooter;
