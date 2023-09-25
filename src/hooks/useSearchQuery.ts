import { useContext } from 'react'
import {SearchQueryContext} from '../context/SearchQueryContext';

const useSearchQuery = () => {
  return useContext(SearchQueryContext);
};

export default useSearchQuery;
