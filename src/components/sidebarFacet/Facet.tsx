import useSearchQuery from '@/hooks/useSearchQuery';
import useURLManager from '@/service/URLManager/useURLManager';
import { FacetKeys } from '@/types'
import { matchCharactersWithRegex } from '@/utils/facet';
import React, { FunctionComponent, useMemo, useState } from 'react'
import mapping from "../../config/mapping.json";
import { deriveNameFromUrl } from '@/config/mapping-helper';

type ViewProps = Omit<FacetProps, "view" | "isFilterable"> & {
  showSearch: boolean;
  onSearch: (x: string) => void;
  searchPlaceholder: string;
  onRemove: (x: string) => void;
  onSelect: (x: string) => void;
  options: FacetList[];
} 

type FacetProps = {
  field: FacetKeys;
  isFilterable: boolean;
  label: string;
  view: FunctionComponent
}
type FacetAggregateBucketItem = {
  key: string;
  doc_count: number;
}
type FacetAggregateBucket = FacetAggregateBucketItem[]

type FacetList = {
  value: string;
  count: number;
  selected: boolean
}

function getFilterValueDisplay(filterValue, label) {
  if (filterValue === undefined || filterValue === null) {
    return "";
  }
  if (Object.prototype.hasOwnProperty.call(filterValue, "name")) {
    return filterValue.name;
  }
  if (label === "domain") {
    if (mapping?.labels[filterValue]) {
      return mapping?.labels[filterValue];
    } else {
      return deriveNameFromUrl(filterValue);
    }
  }
  return String(filterValue);
}

const Facet = ({field, isFilterable, label, view}: FacetProps) => {
  // const [itemsToShow, setItemsToShow] = useState<number>(10)
  const [searchTermFacet, setSearchTermFacet] = useState("")
  const { searchQuery, queryResult: { data } } = useSearchQuery()
  // temporary conditional
  const fieldAggregate: FacetAggregateBucket = field === "domain" ? (data?.aggregations?.["domains"]?.["buckets"] ?? []) : (data?.aggregations?.[field]?.["buckets"] ?? [])
  const { getFilter, addFilter, removeFilter } = useURLManager()
  
  const selectedList = getFilter(field);

  const baseOptions = fieldAggregate.map(item => {
    const selected = selectedList.includes(item.key)
    return ({
      value: item.key,
      count: item.doc_count,
      selected,
      label: getFilterValueDisplay(item.key, field)
    })
  })

  const options = useMemo(() => {
    return baseOptions.filter(item => searchTermFacet.trim() ? (matchCharactersWithRegex(item.label, searchTermFacet)) : true)
  }, [searchTermFacet, baseOptions])

  const onSearch = (val: string) => {
    setSearchTermFacet(val)
  }

  const onRemove = (value: string) => {
    removeFilter({filterType: field, filterValue: value})
  }
  const onSelect = (value: string) => {
    addFilter({filterType: field, filterValue: value})
  }

  const searchPlaceholder = `Filter ${label}`

  const viewProps = {onRemove, onSelect, onSearch, options, field, showSearch: isFilterable, label, searchPlaceholder}

  return React.createElement<ViewProps>(view, Object.assign({}, viewProps));
}

export default Facet