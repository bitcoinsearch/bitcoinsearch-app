import GithubIcon from "../svgs/GithubIcon";

const Separator = ({ className }: { className?: string }) => (
  <div
    className={`hidden xl:block h-6 border-2 border-[#BFBFBF] ${className}`}
  />
);

const ResultFooter = () => {
  return (
    <footer className="bg-white bottom-0 text-left md:text-center flex flex-col md:flex-row gap-y-3 items-center justify-between p-5 md:p-7 2xl:p-10 w-full border-t border-[#BFBFBF] text-xs md:text-base 2xl:text-xl leading-normal">
      <button className="focus:outline-none">
        <GithubIcon className="w-8 h-8 2xl:w-14 2xl:h-14" />
      </button>
      <Separator />
      <p>
        Built with <span>🧡</span> by the{" "}
        <a
          href="https://bitcoindevs.xyz/"
          target="_blank"
          rel="noreferrer"
          className="underline font-medium text-[#EC802F]"
        >
          Bitcoin Dev Project
        </a>
      </p>
      <Separator />
      <a
        href="https://visits.bitcoindevs.xyz/share/0Beh7BUzocqrtgA5/bitcoin-search"
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        View our public visitor counts
      </a>
      <Separator />
      <div className="flex items-center justify-between gap-3 md:gap-8">
        <p>We&apos;d love to hear your feedback on this project</p>
        <button className="text-xs md:text-sm 2xl:text-lg leading-normal font-semibold text-white focus:outline-none px-2 py-3 md:py-4 md:px-6 bg-[#292929] rounded-xl">
          Give feedback
        </button>
      </div>
    </footer>
  );
};

export default ResultFooter;
