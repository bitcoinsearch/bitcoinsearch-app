import React, { useState } from 'react'

type LayoutProps = {
  header: React.ReactNode;
  sideContent: (toggle: () => void) => React.ReactNode;
  bodyContent: React.ReactNode;
  bodyHeader: React.ReactNode;
  bodyFooter: React.ReactNode;
};

const Layout = ({header, sideContent, bodyContent, bodyHeader, bodyFooter}: LayoutProps) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const test = () => {
    setIsOpenSidebar(prev => !prev)
  }
  return (
    <div>
      <section className='py-8 px-6 border-b-[1px] border-b-custom-grey-light'>{header}</section>
      <div className='bg-[#fcfcfc] flex relative'>
        <section data-open={isOpenSidebar} className='py-0 px-6 lg:py-10 lg:px-16 border-r-[1px] border-r-custom-grey-light -translate-x-[429px] absolute h-full lg:relative lg:block lg:translate-x-0 data-[open="true"]:block data-[open="true"]:bg-white data-[open="true"]:translate-x-0 data-[open="true"]:z-10'>
          {sideContent(test)}
        </section>
        <section className='pl-4 lg:pl-20 pr-4 py-5 flex-grow w-full'>
          <button className='absolute right-8 p-2 top-4 bg-red-400 z-10' onClick={test}>temp toggle</button>
          {bodyContent}
          {bodyFooter}
        </section>
      </div>
    </div>
  )
}

export default Layout