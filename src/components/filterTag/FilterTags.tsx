import useURLManager from "@/service/URLManager/useURLManager";
import { FacetKeys } from "@/types";
import { Button } from "@chakra-ui/react";
import React from "react";

type FilterTagProps = {
  field: FacetKeys;
  options: string[];
}

const FilterTags = ({ field, options }: FilterTagProps) => {
  const { getFilter, addFilter, removeFilter } = useURLManager()
  const onRemove = (value: string) => {
    removeFilter({filterType: field, filterValue: value});
  };
  const onAdd = (value: string) => {
    addFilter({filterType: field, filterValue: value});
  };

  const handleToggleFilter = (filter: typeof formattedOptions[number]) => {
    if (filter.selected) {
      onRemove(filter.value);
    } else {
      onAdd(filter.value);
    }
  };

  const filterForField = getFilter(field)
  const formattedOptions = options.map((option) => {
    return {
      value: option,
      selected: Boolean(filterForField?.some((el) => el === option)),
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

export default FilterTags;
