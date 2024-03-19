import React from 'react'

const SidebarSection = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='py-9 border-b-[1px] border-b-[#BFBFBF]'>
      {children}
    </div>
  )
}

export default SidebarSection