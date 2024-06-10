import Image from "next/image";
import type { MenuApp } from "./data";
import Link from "next/link";

export const AppItem = ({ href, image, name, title }: MenuApp) => (
  <Link
    href={href}
    className="font-mona text-custom-primary-text py-2 md:py-3 px-5 md:px-8 gap-3 md:gap-6 flex items-center hover:bg-custom-hover-state dark:hover:bg-custom-stroke first-of-type:pt-4 first-of-type:md:pt-6 last-of-type:pb-4 last-of-type:md:pb-6"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image
      className="rounded-xl w-11 h-11 lg:w-16 lg:h-16"
      src={image}
      alt={name}
      width={88}
      height={88}
    />
    <p className="text-xs md:text-sm xl:text-base 2xl:text-lg text-left ">
      {title}
    </p>
  </Link>
);
