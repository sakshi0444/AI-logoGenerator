"use client";
import React, { useEffect, useState } from "react";
import HeadingDescription from "./HeadingDescription";
import { Loader2Icon } from "lucide-react";

function LogoIdea({ formData, onHandleInputChange, triggerGeneration }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(formData?.idea);
  const [error, setError] = useState(null);

  // Predefined logo concept ideas for a cat service
  const catServiceLogoIdeas = [
    "Minimalist cat silhouette symbolizing care and precision",
    "Elegant line art representing gentle pet handling",
    "Modern geometric cat icon with professional undertones",
    "Simplified paw print integrated with clean typography",
    "Abstract cat outline showcasing movement and grace",
    "Negative space design highlighting cat and service connection"
  ];

  useEffect(() => {
    // Simulate idea generation when triggered
    if (triggerGeneration) {
      generateLogoIdeas();
    }
  }, [triggerGeneration]);

  const generateLogoIdeas = () => {
    setLoading(true);
    
    // Use predefined ideas with some randomization
    const generatedIdeas = [...catServiceLogoIdeas]
      .sort(() => 0.5 - Math.random()) // Shuffle array
      .slice(0, 4); // Take first 4 ideas

    setIdeas(generatedIdeas);
    setLoading(false);

    // Auto-select first idea if no previous selection
    if (!selectedOption && generatedIdeas.length > 0) {
      const firstIdea = generatedIdeas[0];
      setSelectedOption(firstIdea);
      onHandleInputChange(firstIdea);
    }
  };

  return (
    <div className="my-10">
      <HeadingDescription
        title="Select Your Design Idea"
        description="Choose a design concept that best represents your cat service brand."
      />

      <div className="flex items-center justify-center">
        {loading && <Loader2Icon className="animate-spin my-10" />}
        {error && <p className="text-red-500 my-2">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        {ideas.length > 0 &&
          ideas.map((item, index) => (
            <h2
              key={index}
              onClick={() => {
                setSelectedOption(item);
                onHandleInputChange(item);
              }}
              className={`p-2 rounded-full border px-3 cursor-pointer hover:border-primary ${
                selectedOption === item ? "border-primary" : ""
              }`}
            >
              {item}
            </h2>
          ))}

        <h2
          onClick={() => {
            const aiSelectedIdea = "Sophisticated cat service logo with modern elegance";
            setSelectedOption(aiSelectedIdea);
            onHandleInputChange(aiSelectedIdea);
          }}
          className={`p-2 rounded-full border px-3 cursor-pointer hover:border-primary ${
            selectedOption === "Sophisticated cat service logo with modern elegance" 
              ? "border-primary" 
              : ""
          }`}
        >
          Let AI Select the Best Idea
        </h2>
      </div>
    </div>
  );
}

export default LogoIdea;