import { FacetKeys } from "@/types";
import { useRouter } from "next/router";
import { appendFilterName, appendSortName } from "./helper";
import { URLSearchParamsKeyword } from "@/config/config";

type FilterProp = {
  filterType: FacetKeys;
  filterValue: string;
  multiSelect?: boolean;
};

const useURLManager = () => {
  const router = useRouter();
  const urlParams = new URLSearchParams(router.asPath.slice(1));
  const isMobile = window
    ? window.matchMedia("(max-width: 600px)").matches
    : false;

  const getSearchTerm = () => {
    return urlParams.get("search");
  };

  const getFilter = (filterType: FacetKeys) => {
    return urlParams.getAll(appendFilterName(filterType));
  };

  const getSort = (sortField: string) => {
    return urlParams.get(appendSortName(sortField));
  };

  const removePageQueryParams = () => {
    urlParams.delete(URLSearchParamsKeyword["PAGE"]);
  };

  const addSortParams = (sortField: string, value: string) => {
    urlParams.set(appendSortName(sortField), value);
    return urlParams.toString();
  };
  const removeSortParams = (sortField: string) => {
    urlParams.delete(appendSortName(sortField));
    return urlParams.toString();
  };

  const addFilterFromParams = ({
    filterType,
    filterValue,
    multiSelect = true,
  }: FilterProp) => {
    const currentFilterForType = urlParams.getAll(appendFilterName(filterType));
    if (currentFilterForType.includes(filterValue)) return null;
    removePageQueryParams();
    if (multiSelect) {
      urlParams.append(appendFilterName(filterType), filterValue);
    } else {
      urlParams.set(appendFilterName(filterType), filterValue);
    }
    return urlParams.toString();
  };

  const removeFilterFromParams = ({
    filterType,
    filterValue,
    multiSelect = true,
  }: FilterProp) => {
    const appendedFilterName = appendFilterName(filterType);
    const currentFilterForType = urlParams.getAll(appendedFilterName);
    if (!currentFilterForType.length) return null;

    const filterValueIndex = currentFilterForType.findIndex(
      (value) => value === filterValue
    );
    if (filterValueIndex !== -1) {
      removePageQueryParams();
      currentFilterForType.splice(filterValueIndex, 1);
      urlParams.delete(appendedFilterName);
      if (multiSelect) {
        for (let i = 0; i < currentFilterForType.length; i++) {
          urlParams.append(appendedFilterName, currentFilterForType[i]);
        }
      }
      return urlParams.toString();
    }
  };

  const addSort = (sortField: string, value: string) => {
    const params = addSortParams(sortField, value);
    router.push(
      router.pathname + `${params ? "?" + params : params}`,
      undefined,
      { shallow: true, scroll: true }
    );
  };

  const removeSort = (sortField: string) => {
    const params = removeSortParams(sortField);
    router.push(
      router.pathname + `${params ? "?" + params : params}`,
      undefined,
      { shallow: true, scroll: true }
    );
  };

  const addFilter = ({
    filterType,
    filterValue,
    multiSelect = true,
  }: FilterProp) => {
    const params = addFilterFromParams({
      filterType,
      filterValue,
      multiSelect,
    });
    if (params !== null) {
      router.push(
        router.pathname + `${params ? "?" + params : params}`,
        undefined,
        { shallow: true, scroll: true }
      );
    }
  };

  const removeFilter = ({
    filterType,
    filterValue,
    multiSelect = true,
  }: FilterProp) => {
    const params = removeFilterFromParams({
      filterType,
      filterValue,
      multiSelect,
    });
    if (params !== null) {
      router.push(
        router.pathname + `${params ? "?" + params : params}`,
        undefined,
        { shallow: true, scroll: true }
      );
    }
  };

  const toggleFilter = ({
    filterType,
    filterValue,
    multiSelect = true,
  }: FilterProp) => {
    const currentFilterForType = urlParams.getAll(appendFilterName(filterType));
    if (currentFilterForType.includes(filterValue)) {
      removeFilter({ filterType, filterValue, multiSelect });
    } else {
      addFilter({ filterType, filterValue, multiSelect });
    }
  };

  const clearAllFilters = () => {
    const paramKeys = Array.from(urlParams.keys());
    for (const key of paramKeys) {
      if (key.startsWith("filter")) {
        urlParams.delete(key);
      }
    }
  };

  const removeFilterTypes = ({
    filterTypes,
    sortField,
  }: {
    filterTypes: FacetKeys[];
    sortField: string;
  }) => {
    filterTypes.forEach((filterType) => {
      const appendedFilterName = appendFilterName(filterType);
      const currentFilterForType = urlParams.getAll(appendedFilterName);
      if (!currentFilterForType.length) return;
      urlParams.delete(appendedFilterName);
    });

    removeSortParams(sortField);
    removePageQueryParams();
    const params = urlParams.toString();
    router.push(
      router.pathname + `${params ? "?" + params : params}`,
      undefined,
      { shallow: true, scroll: true }
    );
  };

  const setResultsSize = (size: number) => {
    urlParams.set(URLSearchParamsKeyword.SIZE, size.toString());
    router.push(router.pathname + "?" + urlParams.toString(), undefined, {
      shallow: true,
      scroll: true,
    });
  };

  return {
    addFilter,
    removeFilter,
    getFilter,
    clearAllFilters,
    removeFilterTypes,
    getSearchTerm,
    getSort,
    addSort,
    removeSort,
    setResultsSize,
    toggleFilter,
  };
};

export default useURLManager;
