import useIsInitialStateWithoutFilter from "@/hooks/useIsInitialStateWithoutFilter";
import Image from "next/image";

const HomeTextBanner = ({ className }: { className: string }) => {
  const { hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  if (hiddenHomeFacet) return null;

  return (
    <div className={className}>
      <Image
        src="/btc-main.png"
        className="logo mx-auto max-w-[200px] md:max-w-xs lg:max-w-lg 2xl:max-w-xl"
        alt="bitcoin logo"
        width={459}
        height={69}
        priority
      />
      <p className="text-custom-primary-text leading-normal text-sm  sm:text-base lg:text-2xl xl:text-2xl">
        Search the depths of bitcoin’s technical ecosystem
      </p>
    </div>
  );
};

export default HomeTextBanner