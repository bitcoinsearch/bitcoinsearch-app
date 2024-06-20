import ResultSize from "@/components/sidebarFacet/ResultSize";
import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import useUIContext from "@/hooks/useUIContext";
import React, { useState } from "react";

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

  return (
    <div id='sectioned layout' className="bg-custom-background">
      <section
        id="searchbar-mobile-result"
        data-hidden-large={hiddenBody}
        // hidden body conditional for this styling is temporary, refactor search(header) into hero in next version
        className={`data-[hidden-large='false']:md:hidden px-4 pt-5 md:pt-0 ${hiddenBody ? 'pb-[60px] md:pb-[76px] 2xl:pb-[122px]' : 'pb-5'} `}
      >
        {header}
      </section>
      {!hiddenBody && (
        <div
          data-sb-open={sidebarToggleManager.state}
          className="group bg-custom-background flex relative"
        >
          <section id="sidebar" className='font-mona hidden flex-shrink-0 py-0 px-6 lg:py-10 lg:px-16 border-r-[1px] border-r-custom-stroke -translate-x-full w-full md:w-auto md:h-auto md:relative md:block md:translate-x-0 group-data-[sb-open="true"]:block group-data-[sb-open="true"]:bg-custom-background group-data-[sb-open="true"]:translate-x-0'>
            {sideContent}
          </section>
          <section id="body" className="pl-4 lg:pl-20 pr-4 overflow-x-hidden py-0 lg:py-10 group-data-[sb-open='true']:hidden group-data-[sb-open='true']:md:block">
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
    </div>
  );
};

export default Layout;
