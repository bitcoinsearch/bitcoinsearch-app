import { ErrorBoundary } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// COMPONENTS //
import { useCallback, useState } from "react";
import CustomResults from "@/components/customResults/CustomResults";
import { useSearchFocusHotkey } from "@/hooks/useGlobalHotkey";
import NoResults from "@/components/noResultsCard/NoResults";
import FormModal from "@/components/formModal/FormModal";
import LoadingBar from "@/components/loadingBar/LoadingBar";
import Header from "@/layout/Header";
import SideBar from "@/layout/SideBar";
import CustomPagingInfo from "@/components/customPagingInfo/CustomPagingInfo";
import Footer from "@/components/footer/Footer";
import useSearchQuery from "@/hooks/useSearchQuery";
import useScrollTop from "@/hooks/useScrollTop";
import { useRouter } from "next/router";
import { generateFilterQuery } from "@/service/URLManager/helper";
import Image from "next/image";

export default function App() {
  useSearchFocusHotkey();
  
  const [modalOpen, setModalOpen] = useState(false);
  const { searchQuery, queryResult, makeQuery, pagingInfo } = useSearchQuery();
  useScrollTop({current: pagingInfo.current})
  const router = useRouter()
  
  // INFERENCES
  const hasFilters = Boolean(generateFilterQuery(router.asPath.slice(1)).length)
  const hasQueryString = Boolean(searchQuery?.trim())
  const isLoading = queryResult.isFetching;
  const noResult = (hasFilters || hasQueryString) && !isLoading && !queryResult.data?.hits?.total["value"]
  const openForm = useCallback(() => {
    setModalOpen(true);
  }, []);
  const closeForm = () => {
    setModalOpen(false);
  };

  return (
    <div className="App btc-search">
        {isLoading && <LoadingBar />}
        <div className="header">
          <Image src="/btc.png" className="logo" alt="bitcoin logo" width={140} height={140} priority />
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
    </div>
  );
}
