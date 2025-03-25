"use client";

import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { uploadFileToStorage, saveStoryToSupabase } from "../utils/supabaseFunctions";
import { supabase } from "@/config/supabaseConfig";

interface StoryDisplayProps {
  story: string;
  imageUrl: string;
  onGenerateNew: () => void;
}

export default function StoryDisplay({ story, imageUrl, onGenerateNew }: StoryDisplayProps) {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const maxTextForAudio = 500;
  const truncatedStory = story.length > maxTextForAudio ? story.slice(0, maxTextForAudio) : story;

  // Convert Blob to File
  const convertBlobToFile = (blob: Blob, filename: string, mimeType: string) => {
    return new File([blob], filename, { type: mimeType });
  };

  const fetchBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    return await response.blob();
  };

  const handleSaveStory = async () => {
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setSaveMessage("You must be logged in to save your story.");
      return;
    }

    try {
      setSaving(true);
      setSaveMessage(null);

      // Convert the image and audio to blobs
      const imageBlob = await fetchBlob(imageUrl);
      const audioBlob = await fetchBlob("http://127.0.0.1:5002/get_audio");

      // Convert blobs to files
      const imageFile = convertBlobToFile(imageBlob, `story_${Date.now()}.png`, "image/png");
      const audioFile = convertBlobToFile(audioBlob, `story_${Date.now()}.mp3`, "audio/mpeg");

      // Upload to Supabase Storage
      const uploadedImageUrl = await uploadFileToStorage(imageFile, `images/${user.user.id}/`);
      const uploadedAudioUrl = await uploadFileToStorage(audioFile, `audio/${user.user.id}/`);

      if (!uploadedImageUrl || !uploadedAudioUrl) {
        throw new Error("File upload failed.");
      }

      // Save story to Supabase
      await saveStoryToSupabase(user.user.id, story, uploadedImageUrl, uploadedAudioUrl);
      setSaveMessage("Story saved successfully!");
    } catch (error) {
      setSaveMessage("Failed to save story. Please try again.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Your AI-Generated Story</h1>
      <p className="mb-4 whitespace-pre-line">{story}</p>

      {imageUrl ? (
        <img src={imageUrl} alt="Generated Story Illustration" className="w-full h-auto rounded-lg mb-4" />
      ) : (
        <p className="text-gray-500">No image available.</p>
      )}

      <AudioPlayer story={truncatedStory} />

      {/* Save Story Button */}
      <button
        onClick={handleSaveStory}
        className={`mt-4 p-3 ${saving ? "bg-gray-400" : "bg-green-500"} text-white font-bold rounded`}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Story"}
      </button>

      {saveMessage && <p className="mt-2 text-blue-500">{saveMessage}</p>}

      <button
        onClick={onGenerateNew}
        className="mt-4 p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      >
        Generate New Story
      </button>
    </div>
  );
}
