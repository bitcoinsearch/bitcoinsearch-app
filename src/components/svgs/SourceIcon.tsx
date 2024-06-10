import * as React from "react";
import { SVGProps } from "react";

const SourceIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.6641 5.65104H9.9974L8.33073 3.98438H3.33073C2.41406 3.98438 1.6724 4.73437 1.6724 5.65104L1.66406 15.651C1.66406 16.5677 2.41406 17.3177 3.33073 17.3177H16.6641C17.5807 17.3177 18.3307 16.5677 18.3307 15.651V7.31771C18.3307 6.40104 17.5807 5.65104 16.6641 5.65104ZM11.6641 13.9844H4.9974V12.3177H11.6641V13.9844ZM14.9974 10.651H4.9974V8.98438H14.9974V10.651Z"
      fill="currentColor"
    />
  </svg>
);

export default SourceIcon;
