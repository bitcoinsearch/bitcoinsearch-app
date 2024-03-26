import appendClassName from '@/utils/elastic-search-ui-functions'
import React from 'react'

const SidebarSection = ({children, className=""}:{children: React.ReactNode, className?: string}) => {
  return (
    <section className={appendClassName('py-5 lg:py-9 border-b-[1px] border-b-[#BFBFBF] last-of-type:border-none', className)}>
      {children}
    </section>
  )
}

export default SidebarSection