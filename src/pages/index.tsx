import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// COMPONENTS //
import CustomPagingInfo from "@/components/customPagingInfo/CustomPagingInfo";
import CustomResults from "@/components/customResults/CustomResults";
import BodyFooter from "@/components/footer/BodyFooter";
import ResultFooter from "@/components/footer/ResultFooter";
import FormModal from "@/components/formModal/FormModal";
import LoadingBar from "@/components/loadingBar/LoadingBar";
import NoResults from "@/components/noResultsCard/NoResults";
import { useSearchFocusHotkey } from "@/hooks/useGlobalHotkey";
import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import useScrollTop from "@/hooks/useScrollTop";
import useSearchQuery from "@/hooks/useSearchQuery";
import Header from "@/layout/Header";
import SideBar from "@/layout/SideBar";
import { generateFilterQuery } from "@/service/URLManager/helper";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

const HomeTextBanner = () => {
  const { hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  if (hiddenHomeFacet) return null;

  return (
    <div className="flex flex-col gap-4 text-center mb-auto pt-[8%] pb-4">
      <div className="flex gap-2 md:gap-3 items-center self-center">
        <Image
          src="/btc.png"
          className="w-8 h-8 md:w-16 md:h-16"
          alt="bitcoin logo"
          width={36}
          height={36}
          priority
        />
        <p className="text-3xl md:text-6xl font-bold italic text-gray bg-gradient-92 from-brightOrange-100 to-brightOrange-300 text-opacity-0 bg-clip-text p-1">
          bitcoin search
        </p>
      </div>
      <p className="text-sm md:text-2xl text-darkGray-200">
        Search the depths of bitcoin&apos;s technical ecosystem
      </p>
    </div>
  );
};

export default function App() {
  useSearchFocusHotkey();

  const [modalOpen, setModalOpen] = useState(false);
  const { searchQuery, queryResult, makeQuery, pagingInfo } = useSearchQuery();
  useScrollTop({ current: pagingInfo.current });
  const router = useRouter();

  // INFERENCES
  const hasFilters = Boolean(
    generateFilterQuery(router.asPath.slice(1)).length
  );
  const hasQueryString = Boolean(searchQuery?.trim());
  const isLoading = queryResult.isFetching;
  const noResult =
    (hasFilters || hasQueryString) &&
    !isLoading &&
    !queryResult.data?.hits?.total["value"];
  const openForm = useCallback(() => {
    setModalOpen(true);
  }, []);
  const closeForm = () => {
    setModalOpen(false);
  };

  return (
    <div className="App btc-search">
      {isLoading && <LoadingBar />}
      <HomeTextBanner />
      <Layout
        header={<Header openForm={openForm} />}
        sideContent={<SideBar />}
        bodyContent={<CustomResults shouldTrackClickThrough={true} />}
        bodyHeader={<CustomPagingInfo />}
        bodyFooter={<BodyFooter />}
      />
      <ResultFooter />
      {noResult && <NoResults openForm={openForm} />}
      <FormModal formOpen={modalOpen} closeForm={closeForm} />
    </div>
  );
}
