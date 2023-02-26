import { Button } from "@chakra-ui/react";
import { withSearch } from "@elastic/react-search-ui";
import React from "react";
import "./filterTags.scss";

const FilterTags = ({ filters, addFilter, removeFilter, field, options }) => {
  const onRemove = (value) => {
    removeFilter(field, value, "any");
  };
  const onAdd = (value) => {
    addFilter(field, value, "any");
  };

  const handleToggleFilter = (filter) => {
    if (filter.selected) {
      onRemove(filter.value);
    } else {
      onAdd(filter.value);
    }
  };

  const filterForField = () => {
    return filters.find((filter) => filter.field === field);
  };
  const _options = options?.raw ? [...options.raw] : [];
  const formattedOptions = [..._options].map((option) => {
    return {
      value: option,
      selected: Boolean(filterForField()?.values?.some((el) => el === option)),
    };
  });

  return (
    <div className={`${field}-result-container`}>
      {formattedOptions?.map((a, idx) => (
        <Button
          variant="facet-pill"
          size="no-size"
          key={`${a.value}_${idx}`}
          className={`${field}-result-tag ${a.selected ? "tag-selected" : ""}`}
          onClick={() => handleToggleFilter(a)}
        >
          {a.value}
        </Button>
      ))}
    </div>
  );
};

export default withSearch(({ filters, addFilter, removeFilter }) => ({
  filters,
  addFilter,
  removeFilter,
}))(FilterTags);
