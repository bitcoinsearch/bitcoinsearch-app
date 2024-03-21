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
  console.log({ results });

  return (
    <div className={`${isHomePage && "relative"}`}>
      <main className="min-h-[95vh] flex w-full items-center bg-white">
        <NavBar />
        {isLoading && <LoadingBar />}
        <div
          className={`App btc-search w-full ${
            !results.length && !noResult && "-mt-40"
          }`}
        >
          <div className={`header ${results.length && "pt-10"}`}>
            <Image
              src="/btc-main.png"
              className="logo mx-auto max-w-[200px] md:max-w-xs lg:max-w-lg 2xl:max-w-xl"
              alt="bitcoin logo"
              width={459}
              height={69}
              priority
            />
            <p className="text-custom-black-dark leading-normal text-sm  sm:text-base lg:text-2xl xl:text-2xl">
              Search the depths of bitcoin’s technical ecosystem
            </p>
          </div>
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
