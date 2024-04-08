import { useTheme } from "@/context/Theme";
import * as React from "react";
import { SVGProps } from "react";
const ArrowRight = (props: SVGProps<SVGSVGElement>) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <svg
      width={7}
      height={12}
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-red.500"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.64522 5.17724C6.8724 5.39365 7 5.687 7 5.99287C7 6.29873 6.8724 6.59208 6.64522 6.8085L2.07091 11.1621C1.84333 11.3785 1.53471 11.5001 1.21295 11.5C0.891176 11.4999 0.582617 11.3782 0.355145 11.1617C0.127674 10.9452 -7.58015e-05 10.6516 3.37439e-08 10.3454C7.5869e-05 10.0393 0.127971 9.74573 0.35555 9.52931L4.07257 5.99287L0.35555 2.45642C0.134458 2.23884 0.0120353 1.94734 0.0146483 1.64471C0.0172613 1.34208 0.144701 1.05254 0.36952 0.83844C0.594339 0.624342 0.898547 0.50282 1.21663 0.500049C1.5347 0.497277 1.8412 0.613478 2.0701 0.823624L6.64603 5.17647L6.64522 5.17724Z"
        fill={isLight ? "#292929" : "#8E8E93"}
      />
    </svg>
  );
};
export default ArrowRight;
