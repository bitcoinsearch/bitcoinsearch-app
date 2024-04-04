import Image from "next/image";
import React from "react";

const HolocatChatBtc = () => {
  return (
    <div className="flex flex-col md:flex-row items-center p-2 xl:p-3 2xl:p-5 gap-5 max-w-lg xl:max-w-xl 2xl:max-w-2xl md:items-start border rounded-md xl:rounded-2xl border-custom-stroke">
      <Image alt="Holocat " width={88} height={88} src={"/holocat.png"} />
      <div className="flex flex-col gap-1">
        <h3 className="text-base xl:text-lg font-bold text-custom-primary-text">
          Want to Chat with Holocat?
        </h3>
        <p className="text-custom-primary-text text-xs xl:text-sm ">
          {" "}
          Holocat’s read all the mailing lists, podcast articles, and more. Ask
          him any question you’d like to deep dive into.{" "}
        </p>
        <a
          target="_blank"
          href="https://chat.bitcoinsearch.xyz/"
          className="text-custom-background rounded-[10px] p-3 cursor-pointer bg-custom-button max-w-[max-content] text-sm"
        >
          Ask Holocat a Question
        </a>
      </div>
    </div>
  );
};

export default HolocatChatBtc;
