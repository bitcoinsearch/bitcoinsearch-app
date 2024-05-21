import Image from "next/image";
import React from "react";

const HolocatChatBtc = () => {
  return (
    <div className="flex md:flex-row items-start p-2 xl:p-3 2xl:p-5 gap-2 xl:gap-5 max-w-lg xl:max-w-xl 2xl:max-w-2xl md:items-start border rounded-md xl:rounded-2xl border-custom-stroke">
      <Image alt="Holocat " width={88} height={88} src={"/holocat.png"} />
      <div className="flex flex-col gap-1 lg:gap-1.5">
        <a target="_blank" href="https://chat.bitcoinsearch.xyz/">
          <h3 className="text-[14px] lg:text-lg 2xl:text-2xl font-bold text-custom-primary-text">
            Want to Chat with Holocat?
          </h3>
          <p className="text-custom-primary-text text-[12px] xl:text-base 2xl:text-lg ">
            Holocat’s read all the mailing lists, podcast articles, and more.
            Ask him any question you’d like to deep dive into.
          </p>
          <button className="mt-4 text-custom-white rounded-md lg:rounded-[10px] p-2 lg:p-3 hover:bg-custom-accent cursor-pointer bg-custom-black max-w-[max-content] text-[10px] lg:text-sm">
            Ask Holocat a Question
          </button>
        </a>
      </div>
    </div>
  );
};

export default HolocatChatBtc;
