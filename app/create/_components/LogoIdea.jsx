"use client";
import React, { useEffect, useState } from "react";
import HeadingDescription from "./HeadingDescription";
import axios from "axios";
import Prompt from "@/app/_data/Prompt";
import { Loader2Icon } from "lucide-react";

function LogoIdea({ formData, onHandleInputChange, triggerGeneration }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(formData?.idea);
  const [error, setError] = useState(null);
  const [generationAttempted, setGenerationAttempted] = useState(false);

  useEffect(() => {
    if (
      formData &&
      formData.title &&
      formData.desc &&
      formData.design?.title &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    // Only attempt generation once when triggerGeneration becomes true
    if (
      triggerGeneration &&
      !generationAttempted &&
      formData?.title &&
      formData?.desc &&
      formData?.design?.title &&
      formData?.design?.prompt
    ) {
      setGenerationAttempted(true);
      generateLogoDesignIdea();
    }
  }, [triggerGeneration, generationAttempted, formData]);

  const generateLogoDesignIdea = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create the API endpoint for our mock ideas
      // In production, this would call your actual API
      // For now, let's simulate a response
      console.log("Would generate ideas with formData:", formData);
      
      // Mock response if API isn't available
      setTimeout(() => {
        const mockIdeas = [
          `${formData.design.title} for ${formData.title}`,
          `Modern ${formData.title} design`,
          `Creative ${formData.title} emblem`,
          `Professional ${formData.title} symbol`,
          `Unique ${formData.title} mark`
        ];
        
        setIdeas(mockIdeas);
        setLoading(false);
        
        // Auto-select first idea if none is selected yet
        if (!selectedOption) {
          setSelectedOption(mockIdeas[0]);
          onHandleInputChange(mockIdeas[0]);
        }
      }, 1500);
      
      // Uncomment this for real API call when ready:
      /*
      const PROMPT = Prompt.DESIGN_IDEA_PROMPT
        .replace("{logoType}", formData.design.title)
        .replace("{logoTitle}", formData.title)
        .replace("{logoDesc}", formData.desc)
        .replace("{logoPrompt}", formData.design.prompt);

      console.log("Generating ideas with prompt:", PROMPT);

      const result = await axios.post("/api/ai-design-ideas", {
        prompt: PROMPT,
      });

      if (result.data?.ideas && Array.isArray(result.data.ideas)) {
        setIdeas(result.data.ideas);
        
        // Auto-select first idea if none is selected yet
        if (result.data.ideas.length > 0 && !selectedOption) {
          setSelectedOption(result.data.ideas[0]);
          onHandleInputChange(result.data.ideas[0]);
        }
      } else {
        throw new Error("Invalid API response format");
      }
      */
      
    } catch (error) {
      console.error("Error generating logo ideas:", error);
      setError("Failed to generate ideas. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="my-10">
      <HeadingDescription
        title="Select Your Design Idea"
        description="Choose a design style that aligns with your vision, or skip to receive a random suggestion."
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
                selectedOption === item && "border-primary"
              }`}
            >
              {item}
            </h2>
          ))}

        <h2
          onClick={() => {
            setSelectedOption("Let AI Select the best idea");
            onHandleInputChange("Let AI Select the best idea");
          }}
          className={`p-2 rounded-full border px-3 cursor-pointer hover:border-primary ${
            selectedOption === "Let AI Select the best idea" && "border-primary"
          }`}
        >
          Let AI Select the best idea
        </h2>
      </div>
    </div>
  );
}

export default LogoIdea;