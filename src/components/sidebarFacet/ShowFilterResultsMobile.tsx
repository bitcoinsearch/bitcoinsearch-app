import useSearchQuery from "@/hooks/useSearchQuery";
import useUIContext from "@/hooks/useUIContext";
import React from "react";

const ShowFilterResultsMobile = () => {
  const { totalResults } = useSearchQuery().pagingInfo;
  const { sidebarToggleManager } = useUIContext();
  return (
    <div
      className="my-8 ml-auto md:hidden w-fit p-2 text-sm font-semibold text-custom-white bg-custom-primary-text rounded-lg"
      role="button"
      onClick={() => sidebarToggleManager.updater(false)}
    >
      {`Show ${totalResults} results`}
    </div>
  );
};

export default ShowFilterResultsMobile;
