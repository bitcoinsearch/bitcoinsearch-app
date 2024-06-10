import useURLManager from '@/service/URLManager/useURLManager';
import React, { FunctionComponent } from 'react'

type ViewProps = Omit<FacetProps, "view" | "field" | "sortOptions"> & {
  onChange: (x: string) => void;
  options: SortOption[];
  option: SortOption;
  value: string;
} 

type SortOption = {
  label: string;
  value: string;
}

type FacetProps = {
  field: string;
  label: string;
  view: FunctionComponent;
  sortOptions: SortOption[]
  callback?: (x?: SortOption) => void
}

const SortingFacet = ({field, label, view, sortOptions, callback}: FacetProps) => {
  const {getSort, addSort, removeSort } = useURLManager()
  
  const sortField = getSort(field) ?? "";

  const selectedOption = sortOptions.find(option => option.value === sortField) ?? {
    label: "Relevance",
    value: " ",
  }

  const onChange = (x: string) => {
    if (x.trim()) {
      const selectedOption = sortOptions.find(option => option.value === x)
      selectedOption.value && addSort(field, selectedOption.value)
      if (callback) {
        callback(selectedOption)
      }
    } else {
      removeSort(field)
      if (callback) {
        callback(selectedOption)
      }
    }

  }

  const viewProps = {onChange, options: sortOptions, label, value: selectedOption.value, option: selectedOption }

  return React.createElement<ViewProps>(view, Object.assign({}, viewProps));
}

export default SortingFacet