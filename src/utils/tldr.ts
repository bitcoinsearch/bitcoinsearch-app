import { getConfig } from "@/config/config-helper";
import { getMapping } from "@/config/mapping-helper";
const baseUrl = getConfig().tldrBaseUrl
const mapping = getMapping()

export const getUrlForCombinedSummary = (url: string, id: string) => {
  const baseLink = mapping.tldrMappingUrl
  const strippedLink = url.split(baseLink)[1].split("/")

  try {
    // return list, year_month
    const [list, year_month] = strippedLink
  
    // separate month and year from year_month string with the right tldr mapping
    const [year, month] = year_month.split("-").map((i, index) => {
      if (index === 0) return i
      else return mapping.tldrMappingMonths?.[i] ?? ""
    })
  
    if (!month || !year || !list || !id) {
      return url
    } 
  
    const tldrUrl = `${baseUrl}/summary/${list}/${month}_${year}/${id}`
    return tldrUrl
  } catch {
    return url
  }
};
