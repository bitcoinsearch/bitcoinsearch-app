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

  return (
    <div className="bg-custom-background">
      <section className="px-4 pb-8">{header}</section>
      {!hiddenBody && (
        <div
          data-sb-open={sidebarToggleManager.state}
          className="group bg-custom-background flex relative"
        >
          <section className='font-mona hidden flex-shrink-0 py-0 px-6 lg:py-10 lg:px-16 border-r-[1px] border-r-custom-stroke -translate-x-full w-full md:w-auto md:h-auto md:relative md:block md:translate-x-0 group-data-[sb-open="true"]:block group-data-[sb-open="true"]:bg-custom-background group-data-[sb-open="true"]:translate-x-0 group-data-[sb-open="true"]:z-10'>
            {sideContent}
          </section>
          <section className="pl-4 lg:pl-20 pr-4 py-0 lg:py-10 group-data-[sb-open='true']:hidden group-data-[sb-open='true']:md:block">
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
