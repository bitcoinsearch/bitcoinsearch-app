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
import useScrollTop from "@/hooks/useScrollTop";
import useSearchQuery from "@/hooks/useSearchQuery";
import Header from "@/layout/Header";
import SideBar from "@/layout/SideBar";
import { generateFilterQuery } from "@/service/URLManager/helper";
import Image from "next/image";
import useAddSources from "@/hooks/useAddSource";
import { LandingPage } from "@/components/landingPage/LandingPage";
import { useRouter } from "next/router";
import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";

export default function App() {
  useSearchFocusHotkey();

  const { isHomePage } = useIsInitialStateWithoutFilter();
  const {isOpen, closeForm, openForm} = useAddSources()
  const { searchQuery, queryResult, makeQuery, pagingInfo } = useSearchQuery();
  useScrollTop({ current: pagingInfo.current });
  const router = useRouter();

  // INFERENCES
  const hasFilters = Boolean(generateFilterQuery(router.asPath.slice(1)).length);
  const hasQueryString = Boolean(searchQuery?.trim());
  const isLoading = queryResult.isFetching;
  const noResult =
    (hasFilters || hasQueryString) &&
    !isLoading &&
    !queryResult.data?.hits?.total["value"];

  return (
    <div className={`${isHomePage && "relative"}`}>
      <main className='min-h-[95vh] flex w-full items-center justify-center bg-white'>
        {isLoading && <LoadingBar />}
        <div className='App btc-search w-full'>
          <div className='header'>
            <Image
              src='/btc-main.png'
              className='logo mx-auto max-w-[200px] md:max-w-xs lg:max-w-lg 2xl:max-w-xl'
              alt='bitcoin logo'
              width={459}
              height={69}
              priority
            />
            <p className='text-darkGray-300 leading-normal text-sm  sm:text-base lg:text-2xl xl:text-2xl'>
              Search the depths of bitcoin’s technical ecosystem
            </p>
          </div>
          <Layout
            header={<Header openForm={openForm} />}
            sideContent={<SideBar />}
            bodyContent={<CustomResults shouldTrackClickThrough={true} />}
            bodyHeader={<CustomPagingInfo />}
            bodyFooter={<BodyFooter />}
          />
          {noResult && <NoResults openForm={openForm} />}
          <FormModal formOpen={isOpen} closeForm={closeForm} />
        </div>
      </main>
      {NoResults && isHomePage && <LandingPage />}
      <section className={`sticky right-0 left-0 ${!isHomePage && "bottom-0"}`}>
        <ResultFooter />
      </section>
    </div>
  );
}
