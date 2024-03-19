import appendClassName from '@/utils/elastic-search-ui-functions'
import React from 'react'

const SidebarSection = ({children, className=""}:{children: React.ReactNode, className?: string}) => {
  return (
    <div className={appendClassName('py-9 border-b-[1px] border-b-[#BFBFBF]', className)}>
      {children}
    </div>
  )
}

export default SidebarSection