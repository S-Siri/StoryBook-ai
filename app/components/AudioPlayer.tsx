import React, { useState } from "react";

interface AudioPlayerProps {
  story: string;
}

export default function AudioPlayer({ story }: AudioPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleListenToStory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5002/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: story.slice(0, 1000) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
        return;
      }

      const { audio_url } = await response.json();
      setAudioUrl(audio_url);
    } catch (error) {
      setError("An error occurred while trying to play the story.");
      console.error("Audio Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleListenToStory}
        disabled={loading}
        className={`p-3 ${loading ? "bg-gray-400" : "bg-green-500"} text-white font-bold rounded hover:bg-green-600`}
      >
        {loading ? "Loading..." : "Listen to Story"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      {audioUrl && (
  <audio controls>
    <source src={audioUrl} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
)}

    </div>
  );
}
