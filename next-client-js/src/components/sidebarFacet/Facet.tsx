import useSearchQuery from '@/hooks/useSearchQuery';
import useURLManager from '@/service/URLManager/useURLManager';
import { FacetKeys } from '@/types'
import React, { FunctionComponent, useMemo, useState } from 'react'

type ViewProps = Omit<FacetProps, "view" | "isFilterable"> & {
  onMoreClick: () => void;
  showMore: boolean;
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


const Facet = ({field, isFilterable, label, view}: FacetProps) => {
  const [itemsToShow, setItemsToShow] = useState<number>(10)
  const [searchTermFacet, setSearchTermFacet] = useState("")
  const { searchQuery, queryResult: { data } } = useSearchQuery()
  // temporary conditional
  const fieldAggregate: FacetAggregateBucket = field === "domain" ? data?.aggregations?.["domains"]?.["buckets"] ?? [] : data?.aggregations?.[field]?.["buckets"] ?? []
  console.log({fieldAggregate})
  console.log({fieldAggregate})
  const { getFilter, addFilter, removeFilter } = useURLManager()
  
  const selectedList = getFilter(field);

  const baseOptions = fieldAggregate.map(item => {
    const selected = selectedList.includes(item.key)
    return ({
      value: item.key,
      count: item.doc_count,
      selected,
    })
  })

  const options = useMemo(() => {
    return baseOptions.filter(item => searchTermFacet.trim() ? item.value.includes(searchTermFacet) : true).slice(0, itemsToShow)
  }, [searchTermFacet, baseOptions])

  const showMore = itemsToShow < baseOptions.length

  const onMoreClick = () => {
    setItemsToShow(prev => prev + 10)
  }

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

  const viewProps = {onRemove, onSelect, onSearch, onMoreClick, showMore, options, field, showSearch: isFilterable, label, searchPlaceholder}

  return React.createElement<ViewProps>(view, Object.assign({}, viewProps));
}

export default Facet