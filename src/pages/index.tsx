import Layout from "@/layout/Layout";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// COMPONENTS //
import CustomPagingInfo from "@/components/customPagingInfo/CustomPagingInfo";
import CustomResults from "@/components/customResults/CustomResults";
import BodyFooter from "@/components/footer/BodyFooter";
import ResultFooter from "@/components/footer/ResultFooter";
import FormModal from "@/components/formModal/FormModal";
import { LandingPage } from "@/components/landingPage/LandingPage";
import LoadingBar from "@/components/loadingBar/LoadingBar";
import NavBar from "@/components/navBar/NavBar";
import NoResults from "@/components/noResultsCard/NoResults";
import { useSearchFocusHotkey } from "@/hooks/useGlobalHotkey";
import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import useScrollTop from "@/hooks/useScrollTop";
import useSearchQuery from "@/hooks/useSearchQuery";
import useUIContext from "@/hooks/useUIContext";
import Header from "@/layout/Header";
import SideBar from "@/layout/SideBar";
import { generateFilterQuery } from "@/service/URLManager/helper";
import Image from "next/image";
import { useRouter } from "next/router";

const HomeTextBanner = ({ className }: { className: string }) => {
  const { hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  if (hiddenHomeFacet) return null;

  return (
    <div className={className}>
      <Image
        src="/btc-main.png"
        className="logo mx-auto max-w-[200px] md:max-w-xs lg:max-w-lg 2xl:max-w-xl"
        alt="bitcoin logo"
        width={459}
        height={69}
        priority
      />
      <p className="text-custom-primary-text leading-normal text-sm  sm:text-base lg:text-2xl xl:text-2xl">
        Search the depths of bitcoin’s technical ecosystem
      </p>
    </div>
  );
};

export default function App() {
  useSearchFocusHotkey();

  const { isHomePage } = useIsInitialStateWithoutFilter();
  const { isOpen, closeForm, openForm } = useUIContext();
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
  const results = queryResult.data?.hits?.hits ?? [];

  return (
    <div className={`${isHomePage && "relative"} bg-custom-background`}>
      <main className="min-h-[95vh] flex w-full items-center">
        <NavBar />
        {isLoading && <LoadingBar />}
        <div
          className={`App btc-search w-full ${
            !results.length && !noResult && "-mt-40"
          }`}
        >
          <HomeTextBanner className={`header ${results.length && "pt-10"}`} />
          <div className="pt-12"></div>
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
      <section
        className={`${(isLoading || !hasQueryString || noResult) && "hidden"}`}
      >
        <ResultFooter />
      </section>
    </div>
  );
}
