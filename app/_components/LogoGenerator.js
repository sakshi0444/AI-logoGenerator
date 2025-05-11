'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate logo');
      }

      setGeneratedImage(`data:image/png;base64,${data.image}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your logo
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Describe the logo you want to generate..."
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !prompt}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          {loading ? 'Generating...' : 'Generate Logo'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Logo</h2>
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src={generatedImage}
              alt="Generated logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href={generatedImage}
              download="generated-logo.png"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Download Logo
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 