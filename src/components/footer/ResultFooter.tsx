import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import GithubIcon from "../svgs/GithubIcon";

const Separator = ({ className }: { className?: string }) => (
  <div className={`hidden xl:block h-6 border-2 border-gray ${className}`} />
);

const ResultFooter = () => {
  const { hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  if (!hiddenHomeFacet) return null;

  return (
    <footer className="bg-white bottom-0 text-left md:text-center w-full border-t border-gray text-xs md:text-base 2xl:text-xl leading-normal">
      <div className="flex flex-col md:flex-row gap-y-3 items-center justify-between p-5 md:p-7 2xl:p-10 w-full max-w-[1920px] m-auto">
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
            className="underline font-medium text-brightOrange-100"
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
          <button className="text-xs md:text-sm 2xl:text-lg leading-normal font-semibold text-white focus:outline-none px-2 py-3 md:py-4 md:px-6 bg-darkGray-200 rounded-xl">
            Give feedback
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ResultFooter;
