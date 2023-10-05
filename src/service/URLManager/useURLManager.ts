import { FacetKeys } from '@/types'
import { useRouter } from 'next/router'
import { appendFilterName, appendSortName } from './helper'
import { URLSearchParamsKeyword } from '@/config/config'

const useURLManager = () => {
  const router = useRouter()
  const urlParams = new URLSearchParams(router.asPath.slice(1))

  const getFilter = (filterType: FacetKeys) => {
    return urlParams.getAll(appendFilterName(filterType))
  }

  const getSort = (sortField: string) => {
    return urlParams.get(appendSortName(sortField))
  }

  const addSort = (sortField: string, value: string) => {
    urlParams.set(appendSortName(sortField), value)
    router.push(router.pathname + "?" + urlParams.toString())
  }

  const removeSort = (sortField: string) => {
    urlParams.delete(appendSortName(sortField))
    const newUrl = urlParams.toString() ? `${router.pathname}?${urlParams.toString()}` : router.pathname 
    router.push(newUrl)
  }

  const getSearchTerm = () => {
    return urlParams.get("search")
  }

  const addFilter = ({filterType, filterValue}: {filterType: FacetKeys, filterValue: string}) => {
    const currentFilterForType = urlParams.getAll(appendFilterName(filterType))
    if (currentFilterForType.includes(filterValue)) return;
    removePageQuery()
    urlParams.append(appendFilterName(filterType), filterValue)
    router.push(router.pathname + "?" + urlParams.toString())
  }

  const removeFilter = ({filterType, filterValue}) => {
    const appendedFilterName = appendFilterName(filterType)
    const currentFilterForType = urlParams.getAll(appendedFilterName)
    if (currentFilterForType.length) {
      removePageQuery()
      const filterValueIndex = currentFilterForType.findIndex(value => value === filterValue)
      if (filterValueIndex !== -1) {
        currentFilterForType.splice(filterValueIndex, 1)
        
        urlParams.delete(appendedFilterName)
        for (let i = 0; i < currentFilterForType.length; i++) {
          urlParams.append(appendedFilterName, currentFilterForType[i])
        }
        router.push(router.pathname + "?" + urlParams.toString())
      }
    }
  }

  const removePageQuery = () => {
    urlParams.delete(URLSearchParamsKeyword["PAGE"])
  }

  return (
    { addFilter, removeFilter, getFilter, getSearchTerm, getSort, addSort, removeSort }
  )
}

export default useURLManager