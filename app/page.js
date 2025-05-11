import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import LogoGenerator from './_components/LogoGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Logo Generator
          </h1>
          <p className="text-xl text-gray-600">
            Create unique, professional logos with the power of AI
          </p>
        </div>
        <LogoGenerator />
      </div>
    </main>
  );
}
