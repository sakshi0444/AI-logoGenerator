"use client"
import React, { useEffect, useState } from 'react'
import Prompt from '../_data/Prompt';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Share2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Lookup from '../_data/Lookup';

function GenerateLogoPage() {
    const [formData, setFormData] = useState();
    const [logoData, setLogoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const storage = localStorage.getItem('formData')
            if(storage) {
                try {
                    const parsedData = JSON.parse(storage);
                    setFormData(parsedData);
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

    useEffect(() => {
        if(formData?.title) {
            GenerateAILogo();
        }
    }, [formData]);

    const GenerateAILogo = async () => {
        try {
            setLoading(true);
            setError(null);

            // Construct the prompt for the logo generation
            const logoPrompt = Prompt.LOGO_PROMPT
                .replace('{logoTitle}', formData?.title || 'Company Logo')
                .replace('{logoDesc}', formData?.desc || 'Professional and modern logo design')
                .replace('{logoColor}', formData?.palette || 'vibrant colors')
                .replace('{logoDesign}', formData?.design?.title || 'modern')
                .replace('{logoPrompt}', formData?.design?.prompt || '')
                .replace('{logoIdea}', formData?.idea || 'best possible design');

            console.log("Generating logo with prompt:", logoPrompt);
            
            // Call the API to generate the logo
            const response = await axios.post('/api/generate-logo', {
                prompt: logoPrompt,
            }, {
                timeout: 45000, // Increased timeout to 45 seconds
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // Reject only if status is 500 or above
                }
            });
            
            // Check for error in response
            if (response.data.error) {
                throw {
                    message: response.data.error,
                    details: response.data.details || {}
                };
            }

            if (!response.data.imageUrl) {
                throw new Error('No image URL returned from logo generation');
            }

            setLogoData(response.data);
        } catch (err) {
            console.error('Error generating logo:', err);
            
            // More detailed error handling
            let errorMessage = 'Failed to generate logo. Please try again.';
            let errorDetails = '';
            
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // Server responded with an error
                    errorMessage = err.response.data.error || 
                        `Server error: ${err.response.status}`;
                    errorDetails = JSON.stringify(err.response.data.details || {}, null, 2);
                } else if (err.request) {
                    // Request made but no response received
                    errorMessage = 'No response received from server. Please check your internet connection.';
                } else {
                    // Error setting up the request
                    errorMessage = 'Error setting up the logo generation request.';
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
                errorDetails = err.details ? JSON.stringify(err.details, null, 2) : '';
            }

            setError({
                message: errorMessage,
                details: errorDetails
            });
        } finally {
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
                                onClick={() => GenerateAILogo()}
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
                    // ... rest of the existing render code remains the same
                    <div className="flex flex-col items-center">
                        {/* ... existing success state JSX ... */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GenerateLogoPage