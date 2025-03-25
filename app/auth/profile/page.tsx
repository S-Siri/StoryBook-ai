"use client";

import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabaseConfig';
import { useAuth } from '../../components/AuthContext';
import { useEffect, useState } from 'react';

interface Story {
  id: number;
  story: string;
  image_url: string;
  audio_url: string;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else {
      fetchStories();
    }
  }, [user]);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGenerateStory = () => {
    router.push('/story');
  };

  const handleViewStory = (storyId: number) => {
    router.push(`/story/${storyId}`);
  };

  const handleDeleteStory = async (storyId: number) => {
    const storyToDelete = stories.find((story) => story.id === storyId);
    if (!storyToDelete) {
      alert('Story not found.');
      return;
    }
  
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }
  
    try {
      // Delete the story from the database
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);
  
      if (error) throw error;
  
      // Delete the associated image and audio from storage
      const imagePath = storyToDelete.image_url.replace(
        'https://ehzhoonqqsfyvemnhapk.supabase.co/storage/v1/object/public/',
        ''
      );
  
      const audioPath = storyToDelete.audio_url.replace(
        'https://ehzhoonqqsfyvemnhapk.supabase.co/storage/v1/object/public/',
        ''
      );
  
      // Perform the deletions from storage
      const { error: imageError } = await supabase.storage
        .from('story-assets')
        .remove([imagePath]);
  
      const { error: audioError } = await supabase.storage
        .from('story-assets')
        .remove([audioPath]);
  
      if (imageError) {
        console.warn('Failed to delete image:', imageError.message);
      }
  
      if (audioError) {
        console.warn('Failed to delete audio:', audioError.message);
      }
  
      // Remove the story from the UI
      setStories((prevStories) => prevStories.filter((story) => story.id !== storyId));
      alert('Story and its associated media have been deleted successfully!');
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story.');
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl mb-4">Welcome, {user?.email}</h1>

      <div className="space-x-4 mt-6">
        <button 
          onClick={handleGenerateStory} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Story
        </button>

        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-bold mt-8">Your Stories</h2>

      {isLoading ? (
        <p>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p>No stories found. Generate your first story!</p>
      ) : (
        <table className="w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Story</th>
              <th className="p-2">Created At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="border-t">
                <td className="p-2 text-center">{story.story.slice(0, 40)}...</td>
                <td className="p-2 text-center">{new Date(story.created_at).toLocaleString()}</td>
                <td className="p-2 text-center">
                  {/* View Button */}
                  <button 
                    onClick={() => handleViewStory(story.id)} 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                  >
                    View
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteStory(story.id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
