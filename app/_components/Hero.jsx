"use client";
import React, { useState } from "react";
import Lookup from "../_data/Lookup";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  const [logoTitle, setLogoTitle] = useState("");

  return (
    <div className="flex items-center mt-32 flex-col gap-5">
      <h2 className="text-[#ed1e61] text-5xl text-center font-bold">
        {Lookup.HeroHeading}
      </h2>
      <h2 className="text-5xl text-center font-bold">
        {Lookup.HeroSubheading}
      </h2>
      <p className="text-lg text-gray-500 text-center">{Lookup.HeroDesc}</p>

      <div className="flex gap-6 w-full max-w-2xl mt-10">
        <input
          type="text"
          placeholder="Enter Your Logo Name"
          className="p-3 border rounded-md w-full shadow-md"
          value={logoTitle}
          onChange={(e) => setLogoTitle(e.target.value)}
        />

        <Link
          href={logoTitle ? `/create?title=${encodeURIComponent(logoTitle)}` : "#"}
          passHref
        >
          <Button
            className="bg-[#ed1e61] text-white w-70 p-6"
            disabled={!logoTitle}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
