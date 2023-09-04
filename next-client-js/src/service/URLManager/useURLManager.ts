import { FacetKeys } from '@/types'
import { useRouter } from 'next/router'
import { appendFilterName } from './helper'

const useURLManager = () => {
  const router = useRouter()
  const urlParams = new URLSearchParams(router.asPath.slice(1))

  const getFilter = (filterType: FacetKeys) => {
    return urlParams.getAll(appendFilterName(filterType))
  }

  const getSearchTerm = () => {
    return urlParams.get("search")
  }

  const addFilter = ({filterType, filterValue}: {filterType: FacetKeys, filterValue: string}) => {
    const currentFilterForType = urlParams.getAll(appendFilterName(filterType))
    if (currentFilterForType.length) {
      if (currentFilterForType.includes(filterValue)) return;
      urlParams.append(appendFilterName(filterType), filterValue)
      router.push(router.pathname + "?" + urlParams.toString())
    } else {
      urlParams.append(appendFilterName(filterType), filterValue)
      router.push(router.pathname + "?" + urlParams.toString())
    }
  }
  const removeFilter = ({filterType, filterValue}) => {
    const appendedFilterName = appendFilterName(filterType)
    const currentFilterForType = urlParams.getAll(appendedFilterName)
    if (currentFilterForType.length) {
      console.log(currentFilterForType)
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
  return (
    { addFilter, removeFilter, getFilter, getSearchTerm }
  )
}

export default useURLManager