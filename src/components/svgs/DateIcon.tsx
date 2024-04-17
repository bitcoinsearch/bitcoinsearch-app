import { useTheme } from "@/context/Theme";
import * as React from "react";
import { SVGProps } from "react";

const DateIcon = (props: SVGProps<SVGSVGElement>) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <svg width={12} height={14} viewBox='0 0 12 14' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M10.6667 12.666H1.33333V5.33268H10.6667M8.66667 0.666016V1.99935H3.33333V0.666016H2V1.99935H1.33333C0.593333 1.99935 0 2.59268 0 3.33268V12.666C0 13.0196 0.140476 13.3588 0.390524 13.6088C0.640573 13.8589 0.979711 13.9993 1.33333 13.9993H10.6667C11.0203 13.9993 11.3594 13.8589 11.6095 13.6088C11.8595 13.3588 12 13.0196 12 12.666V3.33268C12 2.97906 11.8595 2.63992 11.6095 2.38987C11.3594 2.13982 11.0203 1.99935 10.6667 1.99935H10V0.666016M9.33333 7.99935H6V11.3327H9.33333V7.99935Z'
        fill={isDark ? "#636366" : "#292929"}
      />
    </svg>
  );
};
export default DateIcon;
