import React from "react";
import { isMac } from "../../utils/userOS";

function SearchInput({
  getAutocomplete,
  getButtonProps,
  getInputProps,
  openForm,
}) {
  const isMacDevice = isMac();
  return (
    <div className="search-box-with-contribute">
      <div className="sui-search-box__wrapper">
        <input {...getInputProps()} />
        {getAutocomplete()}
      </div>
      <input {...getButtonProps()} />

      <div className="search-box__info">
        <div className="search-box__keybindings">
          <p>Search:</p>
          <p>
            <kbd>{isMacDevice ? "⌘" : "CTRL"}</kbd> + <kbd>K</kbd> or <kbd>/</kbd>
          </p>
        </div>
        <div className="search-box__contribute-wrapper">
          <span role={"button"} onClick={openForm}>
            Add a source
          </span>
        </div>
      </div>
    </div>
  );
}

export default SearchInput;
