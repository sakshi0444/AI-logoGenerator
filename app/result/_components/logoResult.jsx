"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Lookup from '@/app/_data/Lookup';
import axios from 'axios';

function LogoResult() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Get stored form data from localStorage
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('formData');
      if (storedData) {
        setFormData(JSON.parse(storedData));
      } else {
        setError('No logo data found. Please start the logo creation process.');
        setLoading(false);
        return;
      }
    }
  }, []);

  useEffect(() => {
    // Only generate logo if we have the form data
    if (formData) {
      generateLogo();
    }
  }, [formData]);

  const generateLogo = async () => {
    try {
      setLoading(true);
      
      // Construct the prompt for the logo generation
      const logoPrompt = `Create a logo for "${formData.title}" with the following description: ${formData.desc}. 
        Use colors from the ${formData.palette} palette. 
        Logo style: ${formData.design.title}. 
        Design idea: ${formData.idea || 'best possible design'}. 
        ${formData.design.prompt}`;
      
      // Call the API to generate the logo
      const response = await axios.post('/api/generate-logo', {
        prompt: logoPrompt,
      });
      
      setLogoData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error generating logo:', err);
      setError('Failed to generate logo. Please try again.');
      setLoading(false);
    }
  };

  const downloadLogo = async () => {
    if (!logoData?.imageUrl) return;
    
    try {
      // Fetch the image
      const response = await fetch(logoData.imageUrl);
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${formData.title.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading logo:', err);
      alert('Failed to download the logo. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <div className="max-w-3xl w-full mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ed1e61] mb-4"></div>
            <h2 className="text-2xl font-bold text-[#ed1e61]">
              {Lookup.LoadingWaitTitle || "Your logo is being created"}
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              {Lookup.LoadingWaitDesc || "✨ Please wait a moment while we work our magic to bring your logo to life."}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
            <Link href="/create">
              <Button className="bg-[#ed1e61] mt-4">
                <ArrowLeft className="mr-2" /> Start Over
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#ed1e61] mb-2">
              Your Logo is Ready!
            </h1>
            <p className="text-gray-500 mb-8 text-center">
              Here's your custom logo for {formData?.title}. You can download it or share it.
            </p>
            
            <div className="relative w-full max-w-md aspect-square rounded-xl shadow-lg overflow-hidden mb-8">
              {logoData?.imageUrl && (
                <Image 
                  src={logoData.imageUrl} 
                  alt={`${formData?.title} logo`} 
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
            
            <div className="flex gap-4 mb-10">
              <Button
                className="bg-[#ed1e61]"
                onClick={downloadLogo}
              >
                <Download className="mr-2" /> Download Logo
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2" /> Share
              </Button>
            </div>
            
            <div className="w-full bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="font-bold text-lg mb-2">Logo Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{formData?.title}</p>
                </div>
                <div>
                  <p className="text-gray-500">Style</p>
                  <p className="font-medium">{formData?.design?.title}</p>
                </div>
                <div>
                  <p className="text-gray-500">Color Palette</p>
                  <p className="font-medium">{formData?.palette}</p>
                </div>
                <div>
                  <p className="text-gray-500">Design Idea</p>
                  <p className="font-medium">{formData?.idea || 'AI generated'}</p>
                </div>
              </div>
            </div>
            
            <Link href="/create">
              <Button variant="outline">
                <ArrowLeft className="mr-2" /> Create Another Logo
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoResult;