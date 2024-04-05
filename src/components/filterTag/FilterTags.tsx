import useURLManager from "@/service/URLManager/useURLManager";
import { FacetKeys } from "@/types";
import { Button } from "@chakra-ui/react";
import React from "react";

type FilterTagProps = {
  field: FacetKeys;
  options: string[] | string;
};

const FilterTags = ({ field, options }: FilterTagProps) => {
  const { getFilter, addFilter, removeFilter } = useURLManager();

  if (!Array.isArray(options)) return null;

  const onRemove = (value: string) => {
    removeFilter({ filterType: field, filterValue: value });
  };
  const onAdd = (value: string) => {
    addFilter({ filterType: field, filterValue: value });
  };

  const handleToggleFilter = (filter: (typeof formattedOptions)[number]) => {
    if (filter.selected) {
      onRemove(filter.value);
    } else {
      onAdd(filter.value);
    }
  };

  const filterForField = getFilter(field);
  const formattedOptions = options.map((option) => {
    return {
      value: option,
      selected: Boolean(filterForField?.some((el) => el === option)),
    };
  });

  return (
    <div className={`flex gap-4`}>
      {formattedOptions?.map((a, idx) => (
        <Button
          padding={{base:1,lg:3}}
          size="no-size"
          key={`${a.value}_${idx}`}
          className={`rounded-sm  text-[6px] lg:text-[8px] 2xl:text-base lg:rounded-lg py-3 px-4 border  items-center justify-center border-custom-stroke ${a.selected ? "!bg-custom-accent !text-custom-white" : "!bg-custom-hover-primary !text-custom-primary-text"}`}
          onClick={() => handleToggleFilter(a)}
        >
          {a.value}
        </Button>
      ))}
    </div>
  );
};

export default FilterTags;
