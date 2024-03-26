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
  const { hiddenBody, hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  const { sidebarToggleManager } = useUIContext();
  const test = () => {
    sidebarToggleManager.updater(true);
  };
  return (
    <div>
      <section className="py-8 px-6 border-b-[1px] border-b-custom-grey-light">
        {header}
      </section>
      {!hiddenBody && (
        <div
          data-sb-open={sidebarToggleManager.state}
          className="group bg-[#fcfcfc] flex relative"
        >
          <section
            className='hidden flex-shrink-0 py-0 px-6 lg:py-10 lg:px-16 border-r-[1px] border-r-custom-grey-light -translate-x-full w-full md:w-auto md:h-auto md:relative md:block md:translate-x-0 group-data-[sb-open="true"]:block group-data-[sb-open="true"]:bg-white group-data-[sb-open="true"]:translate-x-0 group-data-[sb-open="true"]:z-10'
          >
            {sideContent}
          </section>
          <section className="pl-4 lg:pl-20 pr-4 py-5 group-data-[sb-open='true']:hidden group-data-[sb-open='true']:md:block">
            <button
              className="absolute md:hidden right-8 p-2 -top-10 bg-red-400 z-[99]"
              onClick={test}
            >
              temp toggle
            </button>
            <div className="block lg:hidden group" data-no-border={true}>
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
