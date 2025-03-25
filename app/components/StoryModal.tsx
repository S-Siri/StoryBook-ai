"use client";

import { useEffect } from "react";

interface StoryModalProps {
  story: any;
  onClose: () => void;
}

export default function StoryModal({ story, onClose }: StoryModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Story Preview</h1>
        <p className="whitespace-pre-line mb-4">{story.story}</p>

        {story.image_url && (
          <img src={story.image_url} alt="Story Illustration" className="mb-4 rounded-lg" />
        )}

        {story.audio_url && (
          <audio controls className="w-full mb-4">
            <source src={story.audio_url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}

        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
}