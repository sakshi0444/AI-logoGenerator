import React from 'react'
import HeadingDescription from './HeadingDescription'
import Lookup from '@/app/_data/Lookup'

function LogoDesc ({onHandleInputChange, formData}){
  return (
    <div className='my-10'>
      <HeadingDescription 
        title=  " Describe  Your Logo Vision"
     description="share your ideas, themes, or inspirations to create a logo that perfectly represents your brand or project"
      />
       <input type='text' placeholder="Describe Your Logo"
      className='p-4 border  rounded-lg mt-5 w-full '
     defaultValue={formData?.desc}
    // value={formData.desc}
     onChange={(e) => onHandleInputChange(e.target.value)}/>

    </div>
  )
}

export default LogoDesc
