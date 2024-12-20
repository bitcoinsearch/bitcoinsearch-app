import useSearchQuery from "@/hooks/useSearchQuery";
import useURLManager from "@/service/URLManager/useURLManager";
import { FacetKeys } from "@/types";
import { getFilterValueDisplay, matchCharactersWithRegex } from "@/utils/facet";
import React, { FunctionComponent, useMemo, useState } from "react";

type ViewProps = Omit<FacetProps, "view" | "isFilterable"> & {
  showSearch: boolean;
  onSearch: (x: string) => void;
  searchPlaceholder: string;
  onRemove: (x: string) => void;
  onSelect: (x: string) => void;
  options: FacetList[];
};

type FacetProps = {
  field: FacetKeys;
  isFilterable: boolean;
  label: string;
  view: FunctionComponent;
  callback?: (x?: any) => void;
};
type FacetAggregateBucketItem = {
  key: string;
  doc_count: number;
};
type FacetAggregateBucket = FacetAggregateBucketItem[];

type FacetList = {
  value: string;
  count: number;
  selected: boolean;
};

const Facet = ({ field, isFilterable, label, view, callback }: FacetProps) => {
  // const [itemsToShow, setItemsToShow] = useState<number>(10)
  const [searchTermFacet, setSearchTermFacet] = useState("");
  const {
    queryResult: { data },
  } = useSearchQuery();
  // temporary conditional
  const fieldAggregate: FacetAggregateBucket =
    data?.aggregations?.[field]?.["buckets"] ?? [];
  const { getFilter, addFilter, removeFilter } = useURLManager();

  const selectedList = getFilter(field);

  const baseOptions = fieldAggregate.map((item) => {
    const selected = selectedList.includes(item.key);
    return {
      value: item.key,
      count: item.doc_count,
      selected,
      label: getFilterValueDisplay(item.key, field),
    };
  });

  const options = useMemo(() => {
    return baseOptions.filter((item) =>
      searchTermFacet.trim()
        ? matchCharactersWithRegex(item.label, searchTermFacet)
        : true
    );
  }, [searchTermFacet, baseOptions]);

  const onSearch = (val: string) => {
    setSearchTermFacet(val);
  };

  const onRemove = (value: string) => {
    removeFilter({ filterType: field, filterValue: value });
    callback && callback(value);
  };
  const onSelect = (value: string) => {
    addFilter({ filterType: field, filterValue: value });
    callback && callback(value);
  };

  const searchPlaceholder = `Filter ${label}`;

  const viewProps = {
    onRemove,
    onSelect,
    onSearch,
    options,
    field,
    showSearch: isFilterable,
    label,
    searchPlaceholder,
  };

  return React.createElement<ViewProps>(view, Object.assign({}, viewProps));
};

export default Facet;
