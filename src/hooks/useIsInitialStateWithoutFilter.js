import useSearchContext from "./useSearchContext";

const useIsInitialStateWithoutFilter = () => {
  let hiddenBody = true;
  let hiddenHomeFacet = true;
  const { state } = useSearchContext();

  if (state) {
    if (
      state.results.length &&
      (state.resultSearchTerm?.trim() ||
        (state.filters.length && state.results?.length))
    ) {
      hiddenBody = false;
    }
    if (!state.resultSearchTerm.trim()) {
      hiddenHomeFacet = true;
    }
  }
  return { hiddenBody, hiddenHomeFacet };
};

export default useIsInitialStateWithoutFilter;
