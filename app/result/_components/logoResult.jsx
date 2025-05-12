"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Lookup from '@/app/_data/Lookup';
import Prompt from '@/app/_data/Prompt';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function LogoResult() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [formData, setFormData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get stored form data from localStorage
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('formData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          // Validate parsed data has required fields
          if (parsedData?.title && parsedData?.desc && parsedData?.design) {
            setFormData(parsedData);
          } else {
            throw new Error('Incomplete logo data');
          }
        } catch (error) {
          console.error('Error parsing stored form data:', error);
          setError('Invalid logo data. Please start the logo creation process again.');
          setLoading(false);
        }
      } else {
        setError('No logo data found. Please start the logo creation process.');
        setLoading(false);
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
      setError(null);
      
      // Construct the prompt for the logo generation using the existing LOGO_PROMPT template
      const logoPrompt = Prompt.LOGO_PROMPT
        .replace('{logoTitle}', formData.title || 'Company Logo')
        .replace('{logoDesc}', formData.desc || 'Professional logo design')
        .replace('{logoColor}', formData.palette || 'vibrant colors')
        .replace('{logoDesign}', formData.design?.title || 'modern')
        .replace('{logoPrompt}', formData.design?.prompt || '')
        .replace('{logoIdea}', formData.idea || 'best possible design');
      
      // Call the API to generate the logo
      const response = await axios.post('/api/generate-logo', {
        prompt: logoPrompt,
      }, {
        timeout: 60000 // Increased timeout to 60 seconds
      });
      
      // Validate response
      if (!response.data.imageUrl) {
        throw new Error('No image URL generated');
      }
      
      setLogoData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error generating logo:', err);
      
      // More detailed error handling
      let errorMessage = 'Failed to generate logo. Please try again.';
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with an error
          errorMessage = err.response.data.error || 
            `Server error: ${err.response.status}`;
        } else if (err.request) {
          // Request made but no response received
          errorMessage = 'No response received from server. Please check your internet connection.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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
      link.download = `${(formData.title || 'logo').replace(/\s+/g, '-').toLowerCase()}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading logo:', err);
      alert('Failed to download the logo. Please try again.');
    }
  };

  const handleRetry = () => {
    // Regenerate the logo
    generateLogo();
  };

  const handleStartOver = () => {
    // Clear stored data and redirect to create page
    localStorage.removeItem('formData');
    router.push('/create');
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
            <div className="flex justify-center gap-4">
              <Button 
                className="bg-[#ed1e61]" 
                onClick={handleRetry}
              >
                <RefreshCw className="mr-2" /> Retry Generation
              </Button>
              <Link href="/create">
                <Button variant="outline">
                  <ArrowLeft className="mr-2" /> Start Over
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#ed1e61] mb-2">
              Your Logo is Ready!
            </h1>
            <p className="text-gray-500 mb-8 text-center">
              Here's your custom logo for {formData?.title || 'your brand'}. You can download it or share it.
            </p>
            
            <div className="relative w-full max-w-md aspect-square rounded-xl shadow-lg overflow-hidden mb-8">
              {logoData?.imageUrl && (
                <Image 
                  src={logoData.imageUrl} 
                  alt={`${formData?.title || 'brand'} logo`} 
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
              <Button 
                variant="outline"
                onClick={handleRetry}
              >
                <RefreshCw className="mr-2" /> Regenerate
              </Button>
            </div>
            
            <div className="w-full bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="font-bold text-lg mb-2">Logo Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{formData?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Style</p>
                  <p className="font-medium">{formData?.design?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Color Palette</p>
                  <p className="font-medium">{formData?.palette || 'AI Selected'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Design Idea</p>
                  <p className="font-medium">{formData?.idea || 'AI generated'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={handleRetry}
              >
                <RefreshCw className="mr-2" /> Regenerate Logo
              </Button>
              <Link href="/create">
                <Button variant="outline">
                  <ArrowLeft className="mr-2" /> Create Another Logo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoResult;