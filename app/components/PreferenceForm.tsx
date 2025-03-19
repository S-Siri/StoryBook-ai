"use client";

import React, { useState } from "react";
import StoryDisplay from "../story/StoryDisplay";

const PreferenceForm = () => {
  const [preferences, setPreferences] = useState({
    characterName: "",
    theme: "",
    genre: "Fantasy",
    language: "English",
    moralMessage: "",
  });

  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStory("");
    setImageUrl("");

    try {
      // Story Generation API Call
      const storyResponse = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (!storyResponse.ok) throw new Error("Failed to generate story");
      const storyData = await storyResponse.json();
      setStory(storyData.story);

      // Image Generation API Call
      const imageResponse = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: storyData.story }),
      });
      if (!imageResponse.ok) throw new Error("Failed to generate image");
      const imageData = await imageResponse.json();
      setImageUrl(imageData.imageUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Create Your Interactive Story</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="characterName"
          value={preferences.characterName}
          onChange={handleChange}
          placeholder="Character Name"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="theme"
          value={preferences.theme}
          onChange={handleChange}
          placeholder="Theme (e.g., Space Adventure)"
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="genre"
          value={preferences.genre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Fantasy</option>
          <option>Adventure</option>
          <option>Mystery</option>
          <option>Comedy</option>
          <option>Education</option>
        </select>

        <select
          name="language"
          value={preferences.language}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
        </select>

        <input
          type="text"
          name="moralMessage"
          value={preferences.moralMessage}
          onChange={handleChange}
          placeholder="Moral of the Story (Optional)"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      {story && <StoryDisplay story={story} imageUrl={imageUrl} onGenerateNew={() => setStory("")} />}
    </div>
  );
};

export default PreferenceForm;
