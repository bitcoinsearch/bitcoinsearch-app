import * as React from "react";
import { SVGProps } from "react";
const CloseIconOutlined = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 1L13 13M13 1L1 13"
      stroke="#4D4D4D"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);
export default CloseIconOutlined;
