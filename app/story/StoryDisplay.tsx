"use client";
import Image from "next/image";
import { useState } from "react";

interface StoryDisplayProps {
  story: string;
  imageUrl: string | undefined;
  onGenerateNew: () => void;
}

export default function StoryDisplay({ story, imageUrl, onGenerateNew }: StoryDisplayProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  console.log("Received Image URL:", imageUrl);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Your AI-Generated Story</h1>
      <p className="mb-4 whitespace-pre-line">{story}</p>

      {imageUrl ? (
        <div className="relative w-full h-auto">
          {isImageLoading && <p className="text-gray-500">Loading image...</p>}
          <Image
            src={imageUrl}
            alt="Generated Story Illustration"
            width={1024}
            height={768}
            className={`w-full h-auto rounded-lg ${isImageLoading ? 'hidden' : 'block'}`}
            priority
            onLoadingComplete={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </div>
      ) : (
        <p className="text-gray-500">No image available. Ensure the image URL is generated properly.</p>
      )}

      <button
        onClick={onGenerateNew}
        className="mt-4 p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      >
        Generate New Story
      </button>
    </div>
  );
}