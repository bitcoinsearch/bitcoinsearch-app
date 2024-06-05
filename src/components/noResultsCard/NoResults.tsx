import { Button } from "@chakra-ui/react";
import React from "react";

const NoResults = ({ openForm }: { openForm: () => void }) => {
  return (
    <div className="no-result bg-custom-background dark:border-[1px] dark:border-custom-stroke">
      <h2 className="text-red-400 text-xl font-medium lg:mb-7">No results found</h2>
      <p className="text-custom-primary-text">You can contribute to our sources by submitting a url</p>
      <div>
        <Button
          onClick={openForm}
          fontWeight={400}
          mx="auto"
          // colorScheme="orange"
          className="!bg-custom-accent"
        >
          Contribute
        </Button>
      </div>
    </div>
  );
};

export default NoResults;
