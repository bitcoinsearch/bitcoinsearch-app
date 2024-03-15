import type { FunctionComponent } from 'react'

export type SortingViewProps = Omit<FacetProps, "view" | "field" | "sortOptions"> & {
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
}