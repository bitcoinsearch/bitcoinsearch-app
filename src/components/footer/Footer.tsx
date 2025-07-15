import { FaDiscord, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import React, { SVGProps } from "react";
const Separator = ({ className }: { className?: string }) => (
  <div
    className={`h-5 border xl:h-6 xl:border-2 border-custom-stroke ${className}`}
  />
);

const NostrIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={31}
    viewBox="0 0 31 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full hover:text-orange-400"
    {...props}
  >
    <path
      d="M31.5 13.5114V29.8827C31.5 30.4984 31.0041 30.998 30.3929 30.998H17.1081C16.4969 30.998 16.001 30.4984 16.001 29.8827V26.8339C16.0615 23.0966 16.454 19.5166 17.2779 17.8879C17.7719 16.9084 18.5861 16.3753 19.5214 16.0901C21.2884 15.5551 24.389 15.9209 25.705 15.858C25.705 15.858 29.6803 16.0173 29.6803 13.7494C29.6803 11.924 27.9035 12.0676 27.9035 12.0676C25.9451 12.1187 24.4534 11.985 23.4869 11.6014C21.8683 10.9602 21.8136 9.78388 21.8077 9.39048C21.7277 4.8467 15.0774 4.30184 9.21796 5.42893C2.81177 6.65635 9.28825 15.9072 9.28825 28.256V29.9044C9.27653 30.5102 8.79036 31 8.18508 31H1.60707C0.995937 31 0.5 30.5004 0.5 29.8847V1.56967C0.5 0.953998 0.995937 0.454378 1.60707 0.454378H7.79067C8.40181 0.454378 8.89775 0.953998 8.89775 1.56967C8.89775 2.48433 9.91891 2.99378 10.657 2.46072C12.8809 0.855648 15.7354 0 18.9297 0C26.0857 0 31.4961 4.20152 31.4961 13.5114H31.5ZM19.6209 10.1891C19.6209 8.87119 18.5607 7.80311 17.2525 7.80311C15.9444 7.80311 14.8841 8.87119 14.8841 10.1891C14.8841 11.507 15.9444 12.5751 17.2525 12.5751C18.5607 12.5751 19.6209 11.507 19.6209 10.1891Z"
      fill="currentColor"
    />
  </svg>
);

const GithubLink = () => (
  <a
    href="https://github.com/bitcoinsearch/bitcoinsearch-app"
    target="_blank"
    rel="noreferrer"
    className="focus:outline-none"
  >
    <FaGithub className="text-[24px] md:text-[40px]" />
  </a>
);

const DiscordLink = () => (
  <a
    href="https://discord.gg/EAy9XMufbY"
    target="_blank"
    rel="noreferrer"
    className="focus:outline-none"
  >
    <FaDiscord className="text-[28px] md:text-[48px]" />
  </a>
);
const XLink = () => (
  <a
    href="https://x.com/bitcoin_devs"
    target="_blank"
    rel="noreferrer"
    className="focus:outline-none"
  >
    <FaXTwitter className="text-[28px] md:text-[48px]" />
  </a>
);
const NostrLink = () => (
  <a
    href="https://iris.to/npub10p33xu03t8q7d9nxtks63dq4gmt4v4d3ppd5lcdp4rg9hxsd0f8q7mn2l2"
    target="_blank"
    rel="noreferrer"
    className="focus:outline-none"
  >
    <NostrIcon className="text-[28px] md:text-[48px]" />
  </a>
);

const StatsLink = () => (
  <a
    href="https://visits.bitcoindevs.xyz/share/0Beh7BUzocqrtgA5/bitcoin-search"
    target="_blank"
    rel="noreferrer"
    className="underline"
  >
    View our public visitor count
  </a>
);

const ContactSocials = () => {
  return (
    <div className="flex items-center gap-2 md:gap-4 lg:gap-4">
      <GithubLink />
      <DiscordLink />
      <XLink />
      <NostrLink />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="text-custom-primary-text bg-custom-background bottom-0 text-left md:text-center w-full border-t border-custom-stroke text-xs md:text-base 2xl:text-xl leading-normal dark:text-custom-primary-text">
      <div className="flex flex-col md:flex-row gap-y-5 items-center justify-between p-5 md:p-7 2xl:p-10 w-full max-w-[1920px] m-auto">
        <div className="hidden md:flex">
          <ContactSocials />
        </div>
        <Separator className="hidden xl:block" />
        <p>
          Built with <span>🧡</span> by the{" "}
          <a
            href="https://bitcoindevs.xyz/"
            target="_blank"
            rel="noreferrer"
            className="underline font-medium text-custom-brightOrange-100"
          >
            Bitcoin Dev Project
          </a>
        </p>
        <Separator className="hidden xl:block" />
        <div className="hidden md:block">
          <StatsLink />
        </div>
        <Separator className="hidden xl:block" />
        <div className="block md:hidden border-[0.5px] border-custom-stroke w-full" />
        <div className="flex w-full md:w-auto items-center justify-between gap-3 md:gap-8">
          <div className="block md:hidden">
            <ContactSocials />
          </div>
          <Separator className="block md:hidden" />
          <div className="block md:hidden max-w-[100px] text-center">
            <StatsLink />
          </div>
          <Separator className="block md:hidden" />
          <p className="hidden md:block">
            We&apos;d love to hear your feedback on this project
          </p>
          <a
            href="https://forms.gle/aLtBMjAeLZiKCFxn8"
            target="_blank"
            className="font-semibold text-white focus:outline-none px-3 py-3 md:py-4 md:px-6 bg-custom-primary-text rounded-xl dark:text-black"
          >
            Give feedback
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
