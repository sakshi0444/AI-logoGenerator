"use client"
import React, { useState, useEffect } from 'react'
import HeadingDescription from './HeadingDescription'
import { useSearchParams } from 'next/navigation'

function LogoTitle({ onHandleInputChange, formData }) {
  const searchParam = useSearchParams();
  const [title, setTitle] = useState('')
  
  useEffect(() => {
    // Get the title from URL params or from formData if available
    const titleFromUrl = searchParam?.get('title');
    const initialTitle = titleFromUrl || formData?.title || '';
    setTitle(initialTitle);
    
    // If we have a title from URL, call the handler to update parent state
    if (titleFromUrl && onHandleInputChange) {
      onHandleInputChange(titleFromUrl);
    }
  }, [searchParam, formData, onHandleInputChange]);

  const handleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onHandleInputChange) {
      onHandleInputChange(newTitle);
    }
  }

  return (
    <div className='my-10'>
      <HeadingDescription 
        title="Logo Title"
        description="Add Your Business, App, or Website Name for a Custom Logo"
      />

      <input 
        type='text' 
        placeholder="Enter Your Logo Name"
        className='p-4 border rounded-lg mt-5 w-full'
        value={title}
        onChange={handleChange}
      />
    </div>
  )
}

export default LogoTitle