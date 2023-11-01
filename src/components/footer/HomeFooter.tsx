import React from "react";
import useIsInitialStateWithoutFilter from "../../hooks/useIsInitialStateWithoutFilter";

const HomeFooter = () => {
  const { hiddenBody } = useIsInitialStateWithoutFilter();
  if (!hiddenBody) {
    return null;
  }
  return (
    <div className="home-footer">
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
        >
          umami
        </a>
        </p>
      </div>
    </div>
  );
};

export default HomeFooter;
