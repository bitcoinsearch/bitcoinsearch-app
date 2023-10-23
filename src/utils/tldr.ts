import { getConfig } from "@/config/config-helper";
import { getMapping } from "@/config/mapping-helper";
const baseUrl = getConfig().tldrBaseUrl

export const getUrlForCombinedSummary = (url="https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2023-/021858.html") => {
  const baseLink = getMapping().tldrMappingUrl
  const strippedLink = url.split(baseLink)[1].split("/")

  try {
    // return list, year_month, id. Remove .html from id
    const [list, year_month, id] = strippedLink.map((i, index) => {
      if (index === 2) return i.split(".")[0]
      return i
    })
  
    // separate month and year from year_month string with the right tldr mapping
    const [year, month] = year_month.split("-").map((i, index) => {
      if (index === 0) return i
      else return getMapping().tldrMappingMonths?.[i] ?? ""
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
