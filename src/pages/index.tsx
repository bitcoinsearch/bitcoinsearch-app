import Layout from "@/layout/Layout";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// COMPONENTS //
import CustomPagingInfo from "@/components/customPagingInfo/CustomPagingInfo";
import CustomResults from "@/components/customResults/CustomResults";
import BodyFooter from "@/components/footer/BodyFooter";
import Footer from "@/components/footer/Footer";
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
import {
  generateFilterQuery,
  generateSortFields,
} from "@/service/URLManager/helper";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { URLSearchParamsKeyword, defaultParam } from "@/config/config";
import { buildQueryCall } from "@/service/api/search/searchCall";
import HomeTextBanner from "@/components/landingPage/HomeTextBanner";

const queryClient = new QueryClient();

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const protocol = context.req.headers["x-forwarded-proto"] || "http"; // Check if behind a proxy
  const host = context.req.headers.host;
  const fetchUrl = `${protocol}://${host}/api/elasticSearchProxy/search`;
  const resolvedUrl = context.resolvedUrl.slice(1);
  const urlParams = new URLSearchParams(resolvedUrl);
  const queryString = urlParams.get(URLSearchParamsKeyword.SEARCH) ?? "";
  const pageQuery = urlParams.get(URLSearchParamsKeyword.PAGE);
  const sizeQuery = urlParams.get(URLSearchParamsKeyword.SIZE);

  const filterFields = generateFilterQuery(resolvedUrl);
  const sortFields = generateSortFields(resolvedUrl);

  if (!queryString.trim() && !filterFields.length) {
    return {
      props: {
        data: null,
        options: null,
      },
    };
  }

  const page = pageQuery ? parseInt(pageQuery) - 1 : 0;
  const size = sizeQuery
    ? parseInt(sizeQuery) || defaultParam[URLSearchParamsKeyword.SIZE]
    : defaultParam[URLSearchParamsKeyword.SIZE];

  const options = {
    queryString,
    size,
    page,
    filterFields,
    sortFields,
  };

  const res = await buildQueryCall(options, fetchUrl);

  await queryClient.prefetchQuery(
    ["query", queryString, size, filterFields, page, sortFields],
    () => res
  );
  const dehydratedState = dehydrate(queryClient);
  return {
    props: {
      dehydratedState,
    },
  };
};

export const App = () => {
  useSearchFocusHotkey();

  const { isHomePage } = useIsInitialStateWithoutFilter();
  const { isOpen, closeForm, openForm } = useUIContext();
  const { searchQuery, queryResult, pagingInfo } = useSearchQuery();
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

  return (
    <div
      className={`${
        isHomePage ? "relative" : ""
      } bg-custom-background text-custom-primary-text`}
    >
      <main
        id="main"
        className="min-h-[95dvh] flex w-full items-center pt-[60px] md:pt-[76px] 2xl:pt-[122px]"
      >
        {isLoading && <LoadingBar />}
        <NavBar />
        <div className={`App btc-search w-full`}>
          <HomeTextBanner className="flex flex-col gap-[1.25rem] text-center pb-[40px] md:pb-[88px]" />
          <Layout
            header={<Header openForm={openForm} />}
            sideContent={<SideBar />}
            bodyContent={<CustomResults shouldTrackClickThrough={true} />}
            bodyHeader={<CustomPagingInfo />}
            bodyFooter={<BodyFooter />}
          />
          {noResult && <NoResults openForm={openForm} />}
          <FormModal
            formOpen={isOpen}
            closeForm={closeForm}
            noResult={noResult}
          />
        </div>
      </main>
      {NoResults && isHomePage && <LandingPage />}
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default App;
