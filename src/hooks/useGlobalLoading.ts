import { useContext } from 'react'
import {SearchQueryContext} from '../context/SearchQueryContext';

const useGlobalLoading = () => {
  return useContext(SearchQueryContext);
};

export default useGlobalLoading;
