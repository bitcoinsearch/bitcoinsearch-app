import React from "react";

function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  openForm,
}) {
  return (
    <div className="search-box-with-contribute">
      <div className="sui-search-box__wrapper">
        <input {...getInputProps()} />
        {getAutocomplete()}
      </div>
      <input {...getButtonProps()} />
      <div className="search-box__contribute-wrapper">
        <span role={"button"} onClick={openForm}>
          Contribute to source?
        </span>
      </div>
    </div>
  );
}

export default SearchInput;
