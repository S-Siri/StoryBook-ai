"use client";

import { useState } from "react";

interface StoryFormProps {
  onGenerate: (preferences: any) => void;
}

export default function StoryForm({ onGenerate }: StoryFormProps) {
  const [characterName, setCharacterName] = useState("");
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("Fantasy");
  const [language, setLanguage] = useState("English");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim() || !theme.trim()) {
      setError("Please enter all fields.");
      return;
    }
    setError("");
    onGenerate({ characterName, theme, genre, language });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-4 text-center">AI Storybook Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Enter your character's name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter a story theme or scenario"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Fantasy</option>
          <option>Adventure</option>
          <option>Mystery</option>
          <option>Comedy</option>
          <option>Education</option>
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Generate Story
        </button>
      </form>
    </div>
  );
}
