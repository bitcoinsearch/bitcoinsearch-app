import React from 'react'


type LayoutProps = Record<string, React.ReactNode>

const Layout = ({header, sideContent, bodyContent, bodyHeader, bodyFooter}: LayoutProps) => {
  return (
    <div>
      <section className='py-8 px-6 border-b-[1px] border-b-custom-grey-light'>{header}</section>
      <div className='bg-[#fcfcfc] flex'>
        <section className='py-10 px-16 border-r-[1px] border-r-custom-grey-light'>
          {sideContent}
        </section>
        <section className='pl-20 pr-2 py-5'>
          {bodyContent}
          {bodyFooter}
        </section>
      </div>
    </div>
  )
}

export default Layout