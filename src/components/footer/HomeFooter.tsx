import GithubIcon from "../svgs/GithubIcon";

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-6 border-2 border-[#BFBFBF] ${className}`}></div>
);

const HomeFooter = () => {
  return (
    <footer className="bg-white lg:text-left fixed bottom-0 gap-7 text-center flex flex-col md:flex-row items-center justify-center p-11 text-black w-full border-t-[1px] border-[#BFBFBF]">
      <div className="flex gap-7 items-center">
        <button className="text-xs font-semibold text-white focus:outline-none py-4 px-6 bg-[#292929] rounded-xl">
          Give feedback
        </button>
        <Separator />
        <div className="flex-grow text-xs text-gray-700">
          Built with <span className="text-red-500">🧡</span> by the{" "}
          <a href="#" className="underline font-medium text-[#EC802F]">
            Bitcoin Dev Project
          </a>
        </div>
        <Separator />
        <a className="text-xs text-gray-700 hover:underline focus:outline-none">
          View our public visitor counts
        </a>
      </div>
      <Separator className="hidden md:block" />
      <div className="flex gap-7 items-center">
        <div className="flex-grow text-xs text-gray-700">
          <p>Stay in touch with the Bitcoin Dev Project</p>
          (Please consider using an email alias.{" "}
          <a href="#" className="hover:underline">
            Here&apos;s how.
          </a>
          )
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="you@email.com"
            className="text-xs text-gray-700 p-4 rounded-xl border border-gray-300 h-full focus:outline-none focus:border-gray-500"
          />
          <button className="text-xs font-semibold text-white focus:outline-none py-4 px-6 bg-[#292929] rounded-xl">
            Keep me updated
          </button>
        </div>
        <button className="focus:outline-none">
          <GithubIcon />
        </button>
      </div>
    </footer>
  );
};

export default HomeFooter;
