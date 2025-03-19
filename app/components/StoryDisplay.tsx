"use client";

import Image from "next/image";
import AudioPlayer from "./AudioPlayer";

interface StoryDisplayProps {
  story: string;
  imageUrl: string;
  onGenerateNew: () => void;
}

export default function StoryDisplay({ story, imageUrl, onGenerateNew }: StoryDisplayProps) {
  const maxTextForAudio = 500;
  const truncatedStory = story.length > maxTextForAudio ? story.slice(0, maxTextForAudio) : story;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Your AI-Generated Story</h1>
      <p className="mb-4 whitespace-pre-line">{story}</p>

      {imageUrl ? (
        <img src={imageUrl} alt="Generated Story Illustration" className="w-full h-auto rounded-lg mb-4" />
      ) : (
        <p className="text-gray-500">No image available.</p>
      )}

      {/* Pass only the truncated text to the AudioPlayer */}
      <AudioPlayer story={truncatedStory} />

      <button
        onClick={onGenerateNew}
        className="mt-4 p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      >
        Generate New Story
      </button>
    </div>
  );
}
