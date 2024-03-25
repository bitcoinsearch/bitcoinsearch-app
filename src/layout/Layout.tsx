import useUIContext from '@/hooks/useUIContext'
import React, { useState } from 'react'

type LayoutProps = Record<string, React.ReactNode>

const Layout = ({header, sideContent, bodyContent, bodyHeader, bodyFooter}: LayoutProps) => {
  // const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const {sidebarToggleManager} = useUIContext()
  const test = () => {
    sidebarToggleManager.updater(true)
  }
  return (
    <div>
      <section className='py-8 px-6 border-b-[1px] border-b-custom-grey-light'>{header}</section>
      <div className='bg-[#fcfcfc] flex relative'>
        <section data-open={sidebarToggleManager.state} className='py-0 px-6 lg:py-10 lg:px-16 border-r-[1px] border-r-custom-grey-light -translate-x-[429px] absolute h-full lg:h-auto lg:relative lg:block lg:translate-x-0 data-[open="true"]:block data-[open="true"]:bg-white data-[open="true"]:translate-x-0 data-[open="true"]:z-10'>
          {sideContent}
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