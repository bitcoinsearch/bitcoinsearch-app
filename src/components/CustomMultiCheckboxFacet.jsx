import React, { useRef } from "react";
import mapping from "../config/mapping.json";
import useCheckboxNavigate from "../hooks/useCheckboxNavigate";
import styles from "./styles.module.scss";

function CustomMultiCheckboxFacet({
  className,
  label,
  onMoreClick,
  onRemove,
  onSelect,
  options,
  showMore,
  showSearch,
  onSearch,
  searchPlaceholder,
}) {
  // This function was modified to add the mapping of names to links using mapping?.labels[filterValue]
  function getFilterValueDisplay(filterValue) {
    if (filterValue === undefined || filterValue === null) {
      return "";
    }
    if (Object.prototype.hasOwnProperty.call(filterValue, "name")) {
      return filterValue.name;
    }
    if (mapping?.labels[filterValue]) {
      return mapping?.labels[filterValue];
    }
    return String(filterValue);
  }

  function getNewClassName(newClassName) {
    if (!Array.isArray(newClassName)) return newClassName;
    return newClassName.filter((name) => name).join(" ");
  }
  function appendClassName(baseClassName, newClassName) {
    if (!newClassName) {
      return (
        (Array.isArray(baseClassName)
          ? baseClassName.join(" ")
          : baseClassName) || ""
      );
    }
    if (!baseClassName) {
      return getNewClassName(newClassName) || "";
    }
    return `${baseClassName} ${getNewClassName(newClassName)}`;
  }

  const searchRef = useRef();
  const multiCheckboxRef = useRef();

  const { currentNavigateCheckbox, toggleRefocus } = useCheckboxNavigate(
    multiCheckboxRef,
    searchRef,
    options
  );

  return (
    <fieldset className={appendClassName("sui-facet", className)}>
      <legend className="sui-facet__title">{label}</legend>

      {showSearch && (
        <div className="sui-facet-search">
          <input
            className="sui-facet-search__text-input"
            type="search"
            placeholder={
              currentNavigateCheckbox || searchPlaceholder || "Search"
            }
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            ref={searchRef}
          />
        </div>
      )}

      <div className="sui-multi-checkbox-facet" ref={multiCheckboxRef}>
        {options.length < 1 && <div>No matching options</div>}
        {options?.map((option) => {
          const checked = option.selected;
          const value = option.value;
          return (
            <label
              key={`${getFilterValueDisplay(option.value)}`}
              htmlFor={`example_facet_${label}${getFilterValueDisplay(
                option.value
              )}`}
              data-checkbox={getFilterValueDisplay(option.value)}
              className={`${styles.checkboxLabel} 
              ${
                getFilterValueDisplay(option.value) === currentNavigateCheckbox
                  ? styles.currentNavigatedLabel
                  : ""
              } 
              ${checked ? styles.checked : ""}
                sui-multi-checkbox-facet__option-label`}
            >
              <div className={styles.checkbox_input_wrapper}>
                <input
                  data-transaction-name={`facet - ${label}`}
                  id={`example_facet_${label}${getFilterValueDisplay(
                    option.value
                  )}`}
                  type="checkbox"
                  className="sui-multi-checkbox-facet__checkbox"
                  checked={checked}
                  onChange={() => (checked ? onRemove(value) : onSelect(value))}
                />
                <span className="">{getFilterValueDisplay(option.value)}</span>
              </div>
              <span className={styles.option_count}>
                {option.count.toLocaleString("en")}
              </span>
            </label>
          );
        })}
      </div>

      {showMore && (
        <button
          type="button"
          className="sui-facet-view-more"
          onClick={() => {
            onMoreClick();
            toggleRefocus();
          }}
          aria-label="Show more options"
        >
          + More
        </button>
      )}
    </fieldset>
  );
}

export default CustomMultiCheckboxFacet;
