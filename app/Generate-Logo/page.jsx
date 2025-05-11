"use client"
import React, { useEffect, useState } from 'react'
import Prompt from '../_data/Prompt';

function page  () {
    const[formData,setFormData]=useState();
   useEffect(()=>{
        if(typeof window != 'undefined'){
            const storage=localStorage.getItem('formData')
            if(storage){
                setFormData(JSON.parse(storage))
                console.log(JSON.parse(storage))
            }
        }
   },[])
   useEffect(()=>{
    if(formData?.title){
        GenerateAILogo();
    }
   },[formData])
   const GenerateAILogo=()=>{
    const PROMPT= Prompt.LOGO_PROMPT.replace('{logoTitle}',formData?.title)
    .replace('{logoDesc}', formData?.desc )
    .replace('{logoColor}',formData?.palette)
    .replace('{logoDesign}',formData?.design?.title)
    .replace('{logoPrompt}',formData?.design?.Prompt);
    console.log(PROMPT);
   }
  return (
    <div>page</div>
  )
}

export default page