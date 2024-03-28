import Image from "next/image";
import type { MenuApp } from "./data";

export const AppItem = ({ href, image, name, title }: MenuApp) => (
  <a href={href} className="py-3 px-8 gap-6 flex items-center">
    <Image
      className="rounded-xl"
      src={image}
      alt={name}
      width={88}
      height={88}
    />
    <p className="text-lg text-custom-lightGrey">{title}</p>
  </a>
);
