import { urlParamsPrefix } from "@/config/config"

export const appendFilterName = (filterType: string) => {
  return `${urlParamsPrefix.FILTER}_${filterType}`
}

export const appendSortName = (sortField: string) => {
  return `${urlParamsPrefix.SORT}_${sortField}`
}
