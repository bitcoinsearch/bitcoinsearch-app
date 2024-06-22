import { Button } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const NoResults = ({ openForm }: { openForm: () => void }) => {
  return (
    <div className="no-result bg-custom-background dark:border-[1px] dark:border-custom-stroke">
      <h2 className="text-red-400 text-xl font-medium lg:mb-7">No results found</h2>
      <p className="text-custom-primary-text">You can contribute to our sources by submitting a url</p>
      <div className="flex flex-col lg:flex-row w-fit gap-4 mx-auto mt-4">
        <Link href="/" className="text-custom-black dark:text-white py-2 px-3 font-bold mx-auto text-sm lg:text-base bg-custom-otherLight rounded-[10px]">
          Go back to homepage
        </Link>
        <button
          onClick={openForm}
          className="flex justify-center items-center gap-2 py-2 px-3 font-bold mx-auto text-sm text-white lg:text-base bg-custom-accent disabled:bg-custom-hover-state disabled:cursor-not-allowed disabled:text-[#CCBAA3] rounded-[10px]"
        >
          <span>Contribute</span>
        </button>
      </div>
    </div>
  );
};

export default NoResults;
