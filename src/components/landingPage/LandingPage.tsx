import React from "react";
import Image from "next/image";
import Link from "next/link";

export const LandingPage = () => {
  return (
    <main className='flex flex-col items-center'>
      <Link
        href='/#why-use-bitcoin'
        className='border-[1.4px] border-[#ffe6cc] p-[10px] rounded-[50%] h-12 w-12 flex items-center justify-center mb-[-24px] z-50 bg-white'
      >
        <Image src='/svg/down-arrow.svg' alt='arrow pointing downwards' width={18.15} height={18.67} />
      </Link>
      <div className='bg-gradient-to-b from-[#E58525] flex flex-col items-center w-full px-4 md:px-10 xl:px-20 min-h-screen'>
        <div className=' flex flex-col gap-10 md:gap-16 lg:gap-24 pt-[80px] w-full max-w-[1600px] items-center'>
          <section className='flex flex-col items-center text-secondary-black text-center max-w-full md:max-w-[1200px] w-full' id='why-use-bitcoin'>
            <p className='text-xs md:text-xl leading-[140%] font-medium'>WHY USE BITCOIN SEARCH</p>
            <h3 className='py-6 md:py-9 lg:py-12 text-[28px] md:text-4xl lg:text-5xl xl:text-[60px] font-bold leading-[120%] md:leading-[120%]'>
              {`Bitcoin Search results are relevant, where traditional search engines aren't`}
            </h3>
            <p className='text-sm md:text-[22px] xl:text-[28px] leading-[140%]'>
              {`Despite everything Google knows about you, it still thinks you're searching for the electric sparks in the sky or ice hockey teams in Florida. We know what you actually mean.`}
            </p>
          </section>

          <section className='flex flex-row items-center justify-between gap-2 md:gap-8 w-full h-[242px] md:h-[350px] lg:h-[400px] xl:h-[441px]'>
            <div className=' w-full h-full relative cursor-pointer'>
              <Image
                src={window.matchMedia("(max-width: 600px)").matches ? "/google-search-image-mobile.png" : "/google-search-image.png"}
                alt='google search image'
                fill
                className=' transform hover:scale-[1.4] hover:translate-x-6 hover:origin-left hover:ease-in-out hover:duration-300 hover:z-30'
              />
            </div>

            <div className=' w-full h-full relative cursor-pointer'>
              <Image
                src={window.matchMedia("(max-width: 600px)").matches ? "/bitcoin-search-image-mobile.png" : "/bitcoin-search-image.png"}
                alt='google search image'
                fill
                className=' transform hover:scale-[1.4] hover:translate-x-[-6px] hover:origin-right hover:ease-in-out hover:duration-300 hover:z-30'
              />
            </div>
          </section>

          <div className='bg-white w-full md:max-h-[576px] rounded-[30px] p-4 md:pr-0 md:pl-5 lg:pl-20 flex flex-col gap-5 md:flex-row items-center md:justify-between mb-[-250px] mt-5 lg:mt-16'>
            <section className='flex flex-col items-center md:items-start text-center md:text-start gap-5 md:gap-8 lg:gap-12 max-w-full md:max-w-[48%] text-tertiary-black mt-0 lg:mt-16'>
              <Image src={"/svg/treasure-icon.svg"} alt='treasure icon' height={70} width={70} className=' h-10 w-10 md:h-16 md:w-16' />
              <h3 className='text-xl md:text-4xl lg:text-[42px] xl:text-[56px] font-medium md:font-bold leading-[130%] md:leading-[120%]'>
                Treasure Trove of Technical Bitcoin Resources
              </h3>
              <p className='text-sm md:text-[20px] lg:text-[28px] leading-[130%]'>
                {`We've built the world's largest collection of technical bitcoin-related resources: articles, podcast transcripts, blog posts, and more.`}
              </p>
            </section>
            <section className='relative w-full md:h-[577px] h-[200px]'>
              <Image src={"/svg/treasure-trove-chart.svg"} alt='trasure trove chart' fill className=' ' />
            </section>
          </div>
        </div>
      </div>

      <div className='w-full rounded-[30px] flex flex-col-reverse md:flex-row gap-6 md:gap-10 xl:gap-[140px] items-center px-4 py-4 md:py-0 md:px-10 xl:px-20 max-w-[1600px] mt-[220px] md:mt-[150px] lg:mt-[250px] xl:mt-[400px]'>
        <section className='relative w-full md:h-[577px] h-[250px] max-h-[576px] max-w-[766px]'>
          <Image src={"/svg/filter-image.svg"} alt='filter image' fill />
        </section>

        <section className='flex flex-col gap-5 md:gap-8 lg:gap-12 max-w-full md:max-w-[48%] text-tertiary-black items-center md:items-start text-center md:text-start p-4 md:p-0'>
          <Image src={"/svg/rounded-checkmark.svg"} alt='treasure icon' height={70} width={70} className=' h-10 w-10 md:h-16 md:w-16' />
          <h3 className='text-xl md:text-4xl lg:text-[42px] xl:text-[56px] font-medium md:font-bold leading-[130%] md:leading-[120%]'>
            Up-to-Date Information
          </h3>
          <p className=' text-sm md:text-[20px] lg:text-[28px] leading-[130%]'>
            Bitcoin Search monitors our sources to make sure your search results are up-to-date.
          </p>
        </section>
      </div>

      <div className='w-full rounded-[30px] flex flex-col md:flex-row justify-between mt-0 xl:mt-[100px] items-center px-4 py-4 md:py-0 md:px-10 lg:px-20  max-w-[1600px] gap-6'>
        <section className='flex items-center md:items-start flex-col max-w-full md:max-w-[48%] gap-5 md:gap-8 lg:gap-12 text-tertiary-black text-center md:text-start py-4 md:py-0'>
          <Image src={"/svg/award-checkmark.svg"} alt='treasure icon' height={70} width={70} />
          <h3 className='text-xl md:text-4xl lg:text-[42px] xl:text-[56px] font-medium md:font-bold leading-[130%] md:leading-[120%]'>
            Credible Sources
          </h3>
          <p className=' text-sm md:text-[20px] lg:text-[28px] leading-[130%]'>
            We hand-pick Bitcoin Search sources for their contributions to technical bitcoin concepts. Examples include the Bitcoin-dev Mailing List,
            LN dev Mailing List, Bitcoin Optech, and many more.
          </p>
        </section>
        <section className='relative w-full max-w-[766px] md:h-[400px] lg:h-[577px] h-[250px] max-h-[576px]'>
          <Image src={"/svg/sources-image.svg"} alt='trasure trove chart' fill />
        </section>
      </div>

      <div className='py-[50px] md:py-[122px]'>
        <button
          onClick={() => {
            window.scrollTo({ top: 0 });
          }}
          className=' rounded-2xl bg-transparent border border-primary-orange gap-3 lg:gap-6  py-[18px] lg:py-9 px-4 lg:px-8 text-primary-orange hover:bg-primary-orange hover:text-white flex items-center justify-center text-[18px] lg:text-[32px] font-semibold'
        >
          <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg' className=' w-4 h-4 lg:w-6 lg:h-6'>
            <path
              d='M12.6667 23.3334C18.5577 23.3334 23.3334 18.5577 23.3334 12.6667C23.3334 6.77563 18.5577 2 12.6667 2C6.77563 2 2 6.77563 2 12.6667C2 18.5577 6.77563 23.3334 12.6667 23.3334Z'
              stroke='currentColor'
              stroke-width='4'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
            <path d='M25.9999 26.0009L20.2666 20.2676' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' />
          </svg>
          Start searching now
        </button>
      </div>
    </main>
  );
};
