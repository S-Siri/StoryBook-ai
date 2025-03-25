"use client";

import React, { useState } from "react";
import StoryDisplay from "../components/StoryDisplay";
import PreferenceForm from "../components/PreferenceForm";
import ProtectedRoute from "../components/ProtectedRoute";

const StoryPage = () => {
  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8">
        {!story ? (
          <PreferenceForm setStory={setStory} setImageUrl={setImageUrl} />
        ) : (
          <StoryDisplay story={story} imageUrl={imageUrl} onGenerateNew={() => setStory("")} />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default StoryPage;
