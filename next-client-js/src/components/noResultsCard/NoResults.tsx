import { Button } from "@chakra-ui/react";
import React from "react";

const NoResults = ({ openForm }: { openForm: () => void }) => {
  return (
    <div className="no-result">
      <h2>No results found</h2>
      <p>You can contribute to our sources by submitting a url</p>
      <div>
        <Button
          onClick={openForm}
          fontWeight={400}
          mx="auto"
          colorScheme="blue"
        >
          Contribute
        </Button>
      </div>
    </div>
  );
};

export default NoResults;
