import { getDomainName } from "@/config/mapping-helper";

type FilterValue =
  | {
      name: string;
      [key: string]: string;
    }
  | string;

export function getFilterValueDisplay(filterValue: FilterValue, label: string) {
  if (typeof filterValue !== "string") {
    return filterValue.name;
  } else {
    if (label === "domain") {
      return getDomainName(filterValue);
    } else return filterValue;
  }
}

export function matchCharactersWithRegex(word: string, searchTerm: string) {
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regexPattern = escapedSearchTerm
    .split("")
    .map((char) => `(?=.*${char})`)
    .join("");

  const regex = new RegExp(regexPattern, "i"); // 'i' flag for case-insensitive matching

  return regex.test(word);
}
