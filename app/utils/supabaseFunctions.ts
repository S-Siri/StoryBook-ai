import { supabase } from "@/config/supabaseConfig";

// Save Story Data to Supabase
export const saveStoryToSupabase = async (
  userId: string,
  story: string,
  imageUrl: string,
  audioUrl: string
) => {
  try {
    const { error } = await supabase
      .from('stories')
      .insert([{ user_id: userId, story, image_url: imageUrl, audio_url: audioUrl }]);

    if (error) {
      throw error;
    }

    console.log("Story saved successfully!");
    return true;
  } catch (error: any) {
    console.error("Error saving story:", error.message || error);
    return false;
  }
};

// Upload File to Supabase Storage with Proper MIME Type
export const uploadFileToStorage = async (file: File, path: string): Promise<string | null> => {
  if (!file) {
    console.error("File is missing.");
    return null;
  }

  try {
    const fileExtension = file.name.split('.').pop();
    const contentType = fileExtension === 'png' ? 'image/png' 
                      : fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' 
                      : fileExtension === 'mp3' ? 'audio/mpeg' 
                      : 'application/octet-stream';

    // Ensure Unique File Name
    const uniquePath = `${path}/${crypto.randomUUID()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('story-assets')
      .upload(uniquePath, file, { contentType });

    if (error) throw error;

    const { data: publicURLData } = supabase.storage.from('story-assets').getPublicUrl(uniquePath);
    return publicURLData.publicUrl;
  } catch (error: any) {
    console.error("Error uploading file:", error.message || error);
    return null;
  }
};

// Delete story by ID
export const deleteStoryFromSupabase = async (storyId: string) => {
  try {
    // Delete from stories table
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting story:", error);
    return false;
  }
};
