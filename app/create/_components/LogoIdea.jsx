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
    if (
      triggerGeneration &&
      formData?.title &&
      formData?.desc &&
      formData?.design?.title &&
      formData?.design?.prompt
    ) {
      generateLogoDesignIdea();
    }
  }, [triggerGeneration]);

  const generateLogoDesignIdea = async () => {
    try {
      setLoading(true);
      setError(null);

      const PROMPT = Prompt.DESIGN_IDEA_PROMPT
        .replace("{logoType}", formData.design.title)
        .replace("{logoTitle}", formData.title)
        .replace("{logoDesc}", formData.desc)
        .replace("{logoPrompt}", formData.design.prompt);

      console.log("Generating ideas with prompt:", PROMPT);

      const result = await axios.post("/api/ai-design-ideas", {
        prompt: PROMPT,
      });

      console.log("API Response:", result.data);

      if (result.data?.ideas && Array.isArray(result.data.ideas)) {
        setIdeas(result.data.ideas);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error generating logo ideas:", error);
      setError("Failed to generate ideas. Please try again.");
    } finally {
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