// CreatePlaylist component - allows users to create new playlists
// Supports optional cover image upload

import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as playlistService from "../../services/playlistService";

const CreatePlaylist = ({ onPlaylistUpdate }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State for playlist name
  const [name, setName] = useState("");
  
  // State for cover image file and preview
  const [coverImg, setCoverImg] = useState(null);
  const [coverImgPreview, setCoverImgPreview] = useState(null);
  
  // Error state for displaying error messages
  const [error, setError] = useState(null);
  
  // Loading state to disable form while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle cover image selection
  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate that it's an image file
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      // Check file size - max 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }
      setError(null);
      setCoverImg(file);
      
      // Create preview image so user can see it before uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Basic playlist data - starts with no songs and 0 duration
      const playlistData = {
        listener: user._id,
        name,
        totalDuration: 0,
        songs: [],
      };

      // If user selected a cover image, we need to send FormData instead of JSON
      // FormData is required when uploading files
      if (coverImg) {
        const formData = new FormData();
        formData.append('listener', user._id);
        formData.append('name', name);
        formData.append('totalDuration', '0');
        formData.append('songs', JSON.stringify([]));
        formData.append('coverImg', coverImg);

        // Use the service method that handles file uploads
        const created = await playlistService.createWithFile(formData);
        if (created.err) throw new Error(created.err);

        // Refresh playlists and navigate to playlists page
        if (onPlaylistUpdate) onPlaylistUpdate();
        navigate('/playlists');
      } else {
        // If no image, we can just send JSON data
        const created = await playlistService.createPlaylist(playlistData);
        if (created.err) throw new Error(created.err);
        
        // Refresh playlists and navigate to playlists page
        if (onPlaylistUpdate) onPlaylistUpdate();
        navigate('/playlists');
      }
    } catch (err) {
      setError(err.message || "Failed to create playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main">
      <div className="form-container">
        <h2>Create New Playlist</h2>
        <form onSubmit={handleSubmit} className="playlist-form">
          {/* Playlist name input */}
          <div className="form-group">
            <label htmlFor="playlistName">Playlist Name: *</label>
            <input
              type="text"
              id="playlistName"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter playlist name"
            />
          </div>

          {/* Cover image upload - optional */}
          <div className="form-group">
            <label htmlFor="playlistCoverImg">Cover Image (optional):</label>
            <input
              type="file"
              id="playlistCoverImg"
              accept="image/*"
              onChange={handleCoverImgChange}
            />
            {/* Show preview if image was selected */}
            {coverImgPreview && (
              <div className="image-preview">
                <img src={coverImgPreview} alt="Playlist cover preview" />
                <button 
                  type="button" 
                  onClick={() => {
                    setCoverImg(null);
                    setCoverImgPreview(null);
                  }}
                  className="btn-danger btn-small"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Form action buttons */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Playlist'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/playlists')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>

          {/* Show error message if something went wrong */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist;
