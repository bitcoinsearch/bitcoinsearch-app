import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BANNER_KEY = "FOSS-banner";

const Banner = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(BANNER_KEY, "hidden");
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const banner_in_session = window.sessionStorage.getItem(BANNER_KEY);
    if (banner_in_session === "hidden") {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;
  return (
    <div className="bg-orange-100 flex items-center w-full sticky top-0 z-[10] p-2">
      <div className="flex flex-col grow items-center text-sm md:text-base text-gray-600 font-medium text-center">
        <p className="">{`Start Your Career in Bitcoin Open Source`}</p>
        <div className="flex gap-2 items-center">
          <span>{`Development in 2024 `}</span>
          <Link href="https://learning.chaincode.com/#FOSS" target="_blank">
            <span className="uppercase text-[#ED8936] underline whitespace-nowrap">{`Apply Today!`}</span>
          </Link>
        </div>
      </div>
      <button
        onClick={handleClose}
        className="relative h-[18px] w-[18px] grid place-items-center rounded-full hover:bg-orange-300"
      >
        <Image src="/close_icon.svg" width={10} height={10} alt="close" />
      </button>
    </div>
  );
};

export default Banner;
