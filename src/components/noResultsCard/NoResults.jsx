import React from "react";
import "./noResults.scss";

const NoResults = ({ openForm }) => {
  return (
    <div className="no-result">
      <h2>No results found</h2>
      <p>You can contribute to our sources by submitting a url</p>
      <div>
        <button onClick={openForm}>Contribute</button>
      </div>
    </div>
  );
};

export default NoResults;
