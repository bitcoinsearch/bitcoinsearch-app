import { ErrorBoundary, WithSearch } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// COMPONENTS //
import { useCallback, useState } from "react";
import CustomResults from "@/components/customResults/CustomResults";
import { useSearchFocusHotkey } from "@/hooks/useGlobalHotkey";
import NoResults from "@/components/noResultsCard/NoResults";
import FormModal from "@/components/formModal/FormModal";
import { useEffect } from "react";
import { useRef } from "react";
import LoadingBar from "@/components/loadingBar/LoadingBar";
import Header from "@/layout/Header";
import SideBar from "@/layout/SideBar";
import CustomPagingInfo from "@/components/customPagingInfo/CustomPagingInfo";
import Footer from "@/components/footer/Footer";
import useSearchQuery from "@/hooks/useSearchQuery";
import useScrollTop from "@/hooks/useSearchQuery";
import useURLManager from "@/service/URLManager/useURLManager"

export default function App() {
  useSearchFocusHotkey();
  useScrollTop()
  const [modalOpen, setModalOpen] = useState(false);
  const { queryResult, makeQuery, pagingInfo } = useSearchQuery();
  
  // INFERENCES
  const isLoading = queryResult.isFetching;
  const noResult = queryResult.isFetched && !queryResult.data?.hits?.total["value"]

  const openForm = useCallback(() => {
    setModalOpen(true);
  }, []);
  const closeForm = () => {
    setModalOpen(false);
  };

  return (
    <div className="App btc-search">
      <ErrorBoundary>
        {/* <ScrollTop current={pagingInfo.current} /> */}
        {isLoading && <LoadingBar />}
        <div className="header">
          <img src="/btc.png" className="logo" alt="bitcoin logo" />
          <p className="description">Technical Bitcoin Search</p>
        </div>
        <Layout
          header={<Header openForm={openForm} />}
          sideContent={<SideBar />}
          bodyContent={<CustomResults shouldTrackClickThrough={true} />}
          bodyHeader={<CustomPagingInfo />}
          bodyFooter={<Footer />}
        />
        {noResult && <NoResults openForm={openForm} />}
        <FormModal formOpen={modalOpen} closeForm={closeForm} />
        <TestNewApi />
      </ErrorBoundary>
    </div>
  );
}

export const TestNewApi = () => {
  const { queryResult, makeQuery } = useSearchQuery();
  const { addFilter, removeFilter } = useURLManager();
  const testFunction = () => {
    removeFilter({filterType: "authors", filterValue: "roasbeef"})
  }
  // useEffect(() => {
  //   console.log("random");
  // }, []);

  // const testFetch = async () => {
  //   const res = await fetch("http://localhost:3000/api/v1/search", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       searchString: "bip",
  //     }),
  //   });
  //   const ss = await res.json();
  //   console.log("fin", ss);
  // };

  return (
    null
    // <button onClick={testFetch}>
    // <button onClick={testFunction}>Test me!</button>
  );
};
