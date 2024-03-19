import mapping from "@/config/mapping.json"
import { deriveNameFromUrl } from "@/config/mapping-helper";

type FilterValue = {
  name: string;
  [key: string]: string
} | string

export function getFilterValueDisplay(filterValue: FilterValue, label: string) {
  if (typeof filterValue !== "string") {
    return filterValue.name;
  } else {
    if (label === "domain") {
      if (mapping?.labels[filterValue]) {
        return mapping?.labels[filterValue];
      } else {
        return deriveNameFromUrl(filterValue);
      }
    }
    else return filterValue;
  }
}
