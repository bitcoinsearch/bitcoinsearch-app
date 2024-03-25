import ResultSize from '@/components/sidebarFacet/ResultSize'
import useIsInitialStateWithoutFilter from '@/hooks/useIsInitialStateWithoutFilter'
import useUIContext from '@/hooks/useUIContext'
import React, { useState } from 'react'

type LayoutProps = Record<string, React.ReactNode>

const Layout = ({header, sideContent, bodyContent, bodyHeader, bodyFooter}: LayoutProps) => {
  const { hiddenBody, hiddenHomeFacet } = useIsInitialStateWithoutFilter();

  const {sidebarToggleManager} = useUIContext()
  const test = () => {
    sidebarToggleManager.updater(true)
  }
  return (
    <div>
      <section className='py-8 px-6 border-b-[1px] border-b-custom-grey-light'>{header}</section>
      {!hiddenBody && <div className='bg-[#fcfcfc] flex relative'>
        <section data-open={sidebarToggleManager.state} className='overflow-scroll flex-shrink-0 py-0 px-6 lg:py-10 lg:px-16 border-r-[1px] border-r-custom-grey-light -translate-x-full absolute h-full w-full md:w-auto md:h-auto md:relative md:block md:translate-x-0 data-[open="true"]:block data-[open="true"]:bg-white data-[open="true"]:translate-x-0 data-[open="true"]:z-10'>
          {sideContent}
        </section>
        <section className='pl-4 lg:pl-20 pr-4 py-5'>
          <button className='absolute right-8 p-2 -top-10 bg-red-400 z-[99]' onClick={test}>temp toggle</button>
          <div className="block lg:hidden group" data-no-border={true}>
            <ResultSize />
          </div>
          {bodyContent}
          {bodyFooter}
        </section>
      </div>}
    </div>
  )
}

export default Layout