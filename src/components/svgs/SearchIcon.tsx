import * as React from "react";
import { SVGProps } from "react";
const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.00001 17C13.4183 17 17 13.4183 17 9.00001C17 4.58173 13.4183 1 9.00001 1C4.58173 1 1 4.58173 1 9.00001C1 13.4183 4.58173 17 9.00001 17Z"
      stroke="currentColor"
      strokeWidth={2}
    />
    <path
      d="M18.9992 19.0002L14.6992 14.7002"
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);
export default SearchIcon;
