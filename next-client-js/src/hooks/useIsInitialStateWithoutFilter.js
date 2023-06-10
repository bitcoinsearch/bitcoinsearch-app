import useSearchContext from "./useSearchContext";
import useSearchQuery from "./useSearchQuery";

const useIsInitialStateWithoutFilter = () => {
  let hiddenBody = true;
  let hiddenHomeFacet = true;
  // const { state } = useSearchContext();
  const { searchQuery, queryResult } = useSearchQuery();

  const resultLength = queryResult.data?.hits?.total?.value;

  if (
    resultLength && searchQuery
  ) {
    hiddenBody = false;
  }
  // if (state) {
  //   if (
  //     resultLength &&
  //     (searchQuery ||
  //       (state.filters.length && state.results?.length))
  //   ) {
  //     hiddenBody = false;
  //   }
  //   // hide facet if there is a searchquery
  //   if (!searchQuery) {
  //     hiddenHomeFacet = false;
  //   }
  // }
  return { hiddenBody, hiddenHomeFacet };
};

export default useIsInitialStateWithoutFilter;
