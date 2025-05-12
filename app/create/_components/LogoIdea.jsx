"use client";
import React, { useEffect, useState } from "react";
import HeadingDescription from "./HeadingDescription";
import { Loader2Icon } from "lucide-react";

function LogoIdea({ formData, onHandleInputChange, triggerGeneration }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(formData?.idea);
  const [error, setError] = useState(null);

  // Predefined logo concept ideas for various brands and industries
  const logoIdeas = [
    "Minimalist geometric icon symbolizing innovation",
    "Elegant line art representing brand essence",
    "Modern abstract symbol showcasing creativity",
    "Simplified iconic design with clean typography",
    "Dynamic negative space concept",
    "Versatile and memorable visual identity",
    "Conceptual representation of brand values",
    "Sleek and professional brand mark",
    "Innovative visual metaphor",
    "Timeless and adaptable logo design"
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
    const generatedIdeas = [...logoIdeas]
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
        description="Choose a design concept that best represents your brand's unique identity."
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
            const aiSelectedIdea = "Sophisticated logo with modern brand essence";
            setSelectedOption(aiSelectedIdea);
            onHandleInputChange(aiSelectedIdea);
          }}
          className={`p-2 rounded-full border px-3 cursor-pointer hover:border-primary ${
            selectedOption === "Sophisticated logo with modern brand essence" 
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