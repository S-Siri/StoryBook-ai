// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/config/supabaseConfig";
// import { useParams, useRouter } from "next/navigation";

// interface Story {
//   id: string;
//   story: string;
//   image_url: string;
//   audio_url: string;
// }

// export default function StoryPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [story, setStory] = useState<Story | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!params?.id) return;

//     const fetchStory = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("stories")
//           .select("*")
//           .eq("id", params.id)
//           .single();

//         if (error) throw error;
//         setStory(data);
//       } catch (err: any) {
//         setError(err.message || "Failed to fetch story");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStory();
//   }, [params.id]);

//   if (loading) return <p>Loading story...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;
//   if (!story) return <p>No story found.</p>;

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-2xl font-bold mb-4">Your AI-Generated Story</h1>
//       <p className="mb-4 whitespace-pre-line">{story.story}</p>

//       <h2 className="text-xl font-semibold">Illustration</h2>
//       {story.image_url ? (
//         <img
//         src={story.image_url.replace(/\/+$/, '')}
//         alt="Generated Story Illustration"
//         className="w-full h-auto rounded-lg mb-4"
//         onError={(e) => console.error("Image failed to load:", e)}
//       />      
      
//       ) : (
//         <p>No image available.</p>
//       )}

//       <h2 className="text-xl font-semibold">Audio Narration</h2>
//       {story.audio_url ? (
//         <audio controls className="w-full">
//         <source src={story.audio_url.replace(/\/+$/, '')} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
      
          
//       ) : (
//         <p>No audio available.</p>
//       )}

//       <button
//         onClick={() => router.push("/auth/profile")}
//         className="mt-4 p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
//       >
//         Back to Profile
//       </button>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseConfig";
import { useParams, useRouter } from "next/navigation";

interface Story {
  id: string;
  story: string;
  image_url: string;
  audio_url: string;
}

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchStory = async () => {
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setStory(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch story");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [params.id]);

  if (loading) return <p>Loading story...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!story) return <p>No story found.</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Your AI-Generated Story</h1>
      <p className="mb-4 whitespace-pre-line">{story.story}</p>
      
      {/* Display Image */}
      <h2 className="text-xl font-semibold">Illustration</h2>
      {story.image_url ? (
        <img
        src={story.image_url.replace(/\/+$/, '')}
          alt="Generated Story Illustration"
          className="w-full h-auto rounded-lg mb-4"
          onError={() => console.error("Image failed to load:", story.image_url)}
        />
      ) : (
        <p>No image available.</p>
      )}

      {/* Display Audio */}
      <h2 className="text-xl font-semibold">Audio Narration</h2>
      {story.audio_url ? (
        <audio controls className="w-full">
          <source src={story.audio_url.replace(/\/+$/, '')} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No audio available.</p>
      )}

      <button
        onClick={() => router.push("/auth/profile")}
        className="mt-4 p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
      >
        Back to Profile
      </button>
    </div>
  );
}

