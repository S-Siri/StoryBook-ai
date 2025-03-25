"use client";
import { useState } from "react";
import Image from "next/image";
import { uploadFileToStorage, saveStoryToSupabase } from "../utils/supabaseFunctions";
import { supabase } from "@/config/supabaseConfig";

interface StoryDisplayProps {
  story: string;
  imageUrl: string | undefined;
  onGenerateNew: () => void;
}

const fetchBlobAsFile = async (url: string, fileName: string, type: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type });
};

const handleSaveStory = async (story: string, imageUrl: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user?.user) {
    alert("You must be logged in to save your story.");
    return;
  }

  try {
    const imageFile = await fetchBlobAsFile(imageUrl, `${Date.now()}_story.png`, "image/png");
    const audioFile = await fetchBlobAsFile("http://127.0.0.1:5002/get_audio", `${Date.now()}_story.mp3`, "audio/mp3");

    const imagePath = `images/${user.user.id}/${imageFile.name}`;
    const audioPath = `audio/${user.user.id}/${audioFile.name}`;

    const uploadedImageUrl = await uploadFileToStorage(imageFile, imagePath);
    const uploadedAudioUrl = await uploadFileToStorage(audioFile, audioPath);

    if (!uploadedImageUrl || !uploadedAudioUrl) {
      throw new Error("File upload failed.");
    }

    const saveSuccess = await saveStoryToSupabase(
      user.user.id,
      story,
      uploadedImageUrl,
      uploadedAudioUrl
    );

    if (saveSuccess) {
      alert("Story saved successfully!");
    } else {
      throw new Error("Failed to save story.");
    }
  } catch (error: any) {
    console.error("Save Error:", error.message || error);
    alert(`Failed to save story: ${error.message || "Unknown error"}`);
  }
};

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
        onClick={() => handleSaveStory(story, imageUrl || "")}
        className="mt-4 p-3 bg-green-500 text-white font-bold rounded hover:bg-green-600"
      >
        Save Story
      </button>

      <button
        onClick={onGenerateNew}
        className="mt-4 p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      >
        Generate New Story
      </button>
    </div>
  );
}
