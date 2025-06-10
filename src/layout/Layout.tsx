import ResultSize from "@/components/sidebarFacet/ResultSize";
import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import useUIContext from "@/hooks/useUIContext";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiExternalLink } from "react-icons/fi";

type LayoutProps = Record<string, React.ReactNode>;

const Layout = ({
  header,
  sideContent,
  bodyContent,
  bodyHeader,
  bodyFooter,
}: LayoutProps) => {
  const { hiddenBody } = useIsInitialStateWithoutFilter();
  const { sidebarToggleManager } = useUIContext();
  const router = useRouter();
  const utmSource = router.query?.utm_source || "";
  const isValidSource = utmSource === "tldr.bitcoinsearch.xyz";

  const isFromTLDR =
    typeof utmSource === "string" &&
    utmSource.includes("tldr.bitcoinsearch.xyz");

  // State for controlling visibility of the floating button and banner
  const [showFloating, setShowFloating] = useState(true);

  return (
    <div id="sectioned layout" className="bg-custom-background">
      <section
        id="searchbar-mobile-result"
        data-hidden-large={hiddenBody}
        // hidden body conditional for this styling is temporary, refactor search(header) into hero in next version
        className={`data-[hidden-large='false']:md:hidden px-4 pt-5 md:pt-0 ${
          hiddenBody ? "pb-[60px] md:pb-[76px] 2xl:pb-[122px]" : "pb-5"
        } `}
      >
        {header}
      </section>
      {!hiddenBody && (
        <div
          data-sb-open={sidebarToggleManager.state}
          className="group bg-custom-background flex relative"
        >
          <section
            id="sidebar"
            className='font-mona hidden flex-shrink-0 py-0 px-6 lg:py-10 lg:px-16 border-r-[1px] border-r-custom-stroke -translate-x-full w-full md:w-auto md:h-auto md:relative md:block md:translate-x-0 group-data-[sb-open="true"]:block group-data-[sb-open="true"]:bg-custom-background group-data-[sb-open="true"]:translate-x-0'
          >
            {sideContent}
          </section>
          <section
            id="body"
            className="pl-4 lg:pl-20 pr-4 overflow-x-hidden py-0 lg:py-10 group-data-[sb-open='true']:hidden group-data-[sb-open='true']:md:block"
          >
            <div
              className="block md:pt-10 lg:hidden group"
              data-no-border={true}
            >
              <ResultSize />
            </div>
            {bodyContent}
            {bodyFooter}
          </section>
        </div>
      )}

      {isFromTLDR && showFloating && (
        <div className="fixed bottom-5 left-5 z-50">
          <div className="relative group">
            <a
              href={isValidSource ? `https://${utmSource}` : null}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white bg-custom-accent rounded-full shadow-lg hover:bg-orange-600 transition-all"
              aria-label="Return to TLDR"
            >
              <FiExternalLink className="text-white" />
              <span>Back to TLDR</span>
            </a>
            <button
              onClick={() => setShowFloating(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-custom-black text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Close button"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
