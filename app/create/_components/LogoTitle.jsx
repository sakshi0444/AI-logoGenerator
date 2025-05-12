"use client";
import React, { useState, useEffect } from "react";
import HeadingDescription from "./HeadingDescription";
import { useSearchParams } from "next/navigation";

function LogoTitle({ onHandleInputChange, formData }) {
  const searchParam = useSearchParams();
  
  // Get title from URL param just once
  const titleFromUrl = searchParam?.get("title");
  
  // Initialize state with any available title
  const [title, setTitle] = useState("");
  
  // Setup effect to initialize title only once
  useEffect(() => {
    const initialTitle = titleFromUrl || formData?.title || "";
    setTitle(initialTitle);
    
    // Only update parent if we have a title from URL
    if (titleFromUrl && onHandleInputChange) {
      onHandleInputChange(titleFromUrl);
    }
  }, []); // Empty dependency array to run only once on mount
  
  const handleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (onHandleInputChange) {
      onHandleInputChange(newTitle);
    }
  };

  return (
    <div className="my-10">
      <HeadingDescription
        title="Logo Title"
        description="Add Your Business, App, or Website Name for a Custom Logo"
      />
      <input
        type="text"
        placeholder="Enter Your Logo Name"
        className="p-4 border rounded-lg mt-5 w-full"
        value={title}
        onChange={handleChange}
      />
    </div>
  );
}

export default LogoTitle;