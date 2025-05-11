"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import HeadingDescription from "./HeadingDescription";
import { useSearchParams } from "next/navigation";

function LogoTitle({ onHandleInputChange, formData }) {
  const searchParam = useSearchParams();
  
  // Memoize the URL parameter to prevent unnecessary re-renders
  const titleFromUrl = useMemo(() => searchParam?.get("title"), [searchParam]);

  // Stable state for title
  const [title, setTitle] = useState(titleFromUrl || formData?.title || "");

  // Wrap function to prevent recreation in each render
  const memoizedHandleInputChange = useCallback(onHandleInputChange, []);

  useEffect(() => {
    // Prevent unnecessary state updates if title hasn't changed
    const initialTitle = titleFromUrl || formData?.title || "";
    if (title !== initialTitle) {
      setTitle(initialTitle);
    }

    // Update parent state when title is received from the URL
    if (titleFromUrl && memoizedHandleInputChange) {
      memoizedHandleInputChange(titleFromUrl);
    }
  }, [titleFromUrl, formData, memoizedHandleInputChange]);

  const handleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (memoizedHandleInputChange) {
      memoizedHandleInputChange(newTitle);
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