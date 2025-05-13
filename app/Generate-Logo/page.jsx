"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Lookup from '../_data/Lookup';
import { createLogoPrompt } from '../_data/Prompt';

function GenerateLogoPage() {
    const [formData, setFormData] = useState(null);
    const [logoData, setLogoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Load data from localStorage on component mount
        if(typeof window !== 'undefined') {
            const storage = localStorage.getItem('formData');
            
            if(storage) {
                try {
                    const parsedData = JSON.parse(storage);
                    setFormData(parsedData);
                    
                    // Validate required fields
                    if (!parsedData?.title) {
                        router.push('/create');
                    }
                } catch (parseError) {
                    console.error('Error parsing stored form data:', parseError);
                    router.push('/create');
                }
            } else {
                // Redirect to create page if no data
                router.push('/create');
            }
        }
    }, [router]);

    // Only trigger logo generation when formData is available
    useEffect(() => {
        if(formData?.title) {
            generateLogo();
        }
    }, [formData]);

    const generateLogo = async () => {
        try {
            setLoading(true);
            setError(null);

            // Use our improved prompt generator
            const logoPrompt = createLogoPrompt(formData);

            console.log("Generating logo with prompt:", logoPrompt);

            // Validate the prompt before sending
            if (!logoPrompt || logoPrompt.trim() === '') {
                throw new Error('Generated prompt is empty or invalid');
            }

            const response = await axios({
                method: 'post',
                url: '/api/generate-logo',
                data: { prompt: logoPrompt },
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // 60 second timeout
            });
            
            // Check if response contains expected data
            if (!response.data || response.data.error) {
                throw new Error(response.data?.error || 'Failed to generate logo image');
            }

            if (!response.data.imageUrl) {
                throw new Error('No image URL returned from logo generation');
            }

            setLogoData(response.data);
            setLoading(false);
            
        } catch (err) {
            console.error('Error generating logo:', err);
            
            // Enhanced error reporting
            let errorMessage = 'Failed to generate logo. Please try again.';
            let errorDetails = '';
            
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // This is where the 405 error is being caught
                    errorMessage = `Server error: ${err.response.status} - ${err.response.statusText}`;
                    if (err.response.status === 405) {
                        errorMessage = 'API Error: Method Not Allowed. Please check the API endpoint configuration.';
                    }
                    errorDetails = JSON.stringify(err.response.data || {}, null, 2);
                } else if (err.request) {
                    errorMessage = 'Request timeout. The server took too long to respond.';
                } else {
                    errorMessage = err.message || 'Error setting up the request';
                }
            } else if (err instanceof Error) {
                errorMessage = err.message || 'Unknown error occurred';
            }

            setError({
                message: errorMessage,
                details: errorDetails
            });
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
            URL.revokeObjectURL(downloadUrl); // Clean up
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
                        <h2 className="text-xl font-bold text-red-500 mb-4">
                            {error.message}
                        </h2>
                        {error.details && (
                            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left overflow-x-auto">
                                <pre className="text-sm text-gray-700">
                                    {error.details}
                                </pre>
                            </div>
                        )}
                        <div className="flex justify-center gap-4">
                            <Button 
                                className="bg-[#ed1e61]" 
                                onClick={generateLogo}
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
                            <Button 
                                variant="outline"
                                onClick={generateLogo}
                            >
                                <RefreshCw className="mr-2" /> Regenerate
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GenerateLogoPage;