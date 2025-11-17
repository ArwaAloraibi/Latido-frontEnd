// CreateAlbum component - allows artists to create new albums with songs
// Handles file uploads for album cover images and MP3 files for songs

import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as albumService from "../../services/albumService";

const CreateAlbum = ({ onAlbumUpdate }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State for album name
  const [name, setName] = useState("");
  
  // State for album cover image file and preview
  const [coverImg, setCoverImg] = useState(null);
  const [coverImgPreview, setCoverImgPreview] = useState(null);
  
  // State for songs array - each song has name, duration, mp3 file, and optional cover image
  const [songs, setSongs] = useState([{ name: "", duration: 0, mp3File: null, coverImg: null, coverImgPreview: null }]);
  
  // Error state for displaying error messages
  const [error, setError] = useState(null);
  
  // Loading state to disable form while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Progress message to show user what's happening
  const [uploadProgress, setUploadProgress] = useState("");

  // Handle album cover image selection
  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Make sure it's actually an image file
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
      
      // Create a preview so user can see the image before uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update a specific field of a specific song
  const handleSongChange = (index, field, value) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    setSongs(updatedSongs);
  };

  // Handle MP3 file selection for a song
  const handleSongMP3Change = (index, file) => {
    if (!file) return;
    
    // Validate that it's an audio file
    if (!file.type.includes('audio') && !file.name.endsWith('.mp3')) {
      setError(`Song ${index + 1}: Please select a valid MP3 audio file`);
      return;
    }
    
    // Check file size - max 10MB for audio files
    if (file.size > 10 * 1024 * 1024) {
      setError(`Song ${index + 1}: Audio file size must be less than 10MB`);
      return;
    }
    
    setError(null);
    const updatedSongs = [...songs];
    updatedSongs[index].mp3File = file;
    
    // Try to automatically get the duration from the audio file
    // This uses the HTML5 Audio API to read the file metadata
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      // When metadata loads, we get the duration in seconds
      updatedSongs[index].duration = Math.floor(audio.duration);
      setSongs([...updatedSongs]);
      // Clean up the object URL to free memory
      URL.revokeObjectURL(audio.src);
    });
    
    setSongs(updatedSongs);
  };

  // Handle song cover image selection
  const handleSongCoverImgChange = (index, file) => {
    if (!file) return;
    
    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      setError(`Song ${index + 1}: Please select a valid image file`);
      return;
    }
    
    // Check file size - max 2MB for song covers
    if (file.size > 2 * 1024 * 1024) {
      setError(`Song ${index + 1}: Image file size must be less than 2MB`);
      return;
    }
    
    setError(null);
    const updatedSongs = [...songs];
    updatedSongs[index].coverImg = file;
    
    // Create preview for the song cover image
    const reader = new FileReader();
    reader.onloadend = () => {
      updatedSongs[index].coverImgPreview = reader.result;
      setSongs([...updatedSongs]);
    };
    reader.readAsDataURL(file);
  };

  // Add a new empty song field to the form
  const addSong = () => {
    setSongs([...songs, { name: "", duration: 0, mp3File: null, coverImg: null, coverImgPreview: null }]);
  };

  // Remove a song from the form
  const removeSong = (index) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setUploadProgress("Preparing files...");

    try {
      // Make sure at least one song has an MP3 file uploaded
      const songsWithFiles = songs.filter(s => s.name.trim() && s.mp3File);
      if (songsWithFiles.length === 0) {
        throw new Error("At least one song must have an MP3 file uploaded");
      }

      // Create FormData object to send files to the backend
      // FormData is needed when uploading files
      const formData = new FormData();
      formData.append('name', name.trim());
      
      // Add album cover image if one was selected
      if (coverImg) {
        formData.append('coverImg', coverImg);
      }

      // Add each song's data to the FormData
      // We use index numbers in the field names so backend knows which files belong together
      songsWithFiles.forEach((song, index) => {
        formData.append(`songName_${index}`, song.name.trim());
        formData.append(`songDuration_${index}`, song.duration || 0);
        formData.append(`songMP3_${index}`, song.mp3File);
        // Add song cover image if one was selected
        if (song.coverImg) {
          formData.append(`songCoverImg_${index}`, song.coverImg);
        }
      });

      setUploadProgress("Uploading album...");
      // Send the FormData to the backend
      const created = await albumService.createWithFiles(formData);
      
      if (created.err) throw new Error(created.err);

      setUploadProgress("Album created successfully!");
      // Refresh the albums list in the parent component
      if (onAlbumUpdate) onAlbumUpdate();
      // Navigate to My Albums page after a short delay
      setTimeout(() => {
        navigate('/my-albums');
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to create album");
      setUploadProgress("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main">
      <div className="form-container">
        <h2>Create New Album</h2>
        <form onSubmit={handleSubmit} className="album-form">
          {/* Album name input */}
          <div className="form-group">
            <label htmlFor="albumName">Album Name: *</label>
            <input
              type="text"
              id="albumName"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter album name"
            />
          </div>

          {/* Album cover image upload */}
          <div className="form-group">
            <label htmlFor="albumCoverImg">Album Cover Image (optional):</label>
            <input
              type="file"
              id="albumCoverImg"
              accept="image/*"
              onChange={handleCoverImgChange}
            />
            {/* Show preview if image was selected */}
            {coverImgPreview && (
              <div className="image-preview">
                <img src={coverImgPreview} alt="Album cover preview" />
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

          {/* Songs section - can add multiple songs */}
          <div className="form-group">
            <div className="form-group-header">
              <label>Songs: *</label>
              <button type="button" onClick={addSong} className="btn-secondary">
                + Add Song
              </button>
            </div>
            {/* Map through each song and show input fields */}
            {songs.map((song, index) => (
              <div key={index} className="song-input-group">
                <div className="song-input-row">
                  {/* Song name input */}
                  <div className="input-field">
                    <label>Song Name: *</label>
                    <input
                      type="text"
                      value={song.name}
                      required
                      onChange={(e) => handleSongChange(index, 'name', e.target.value)}
                      placeholder="Enter song name"
                    />
                  </div>
                  {/* Duration display - auto-calculated from MP3 */}
                  <div className="input-field">
                    <label>Duration (seconds):</label>
                    <input
                      type="number"
                      value={song.duration}
                      min="0"
                      readOnly
                      style={{ backgroundColor: 'rgba(75, 0, 130, 0.2)' }}
                    />
                    <small style={{ color: '#d0c3ff', fontSize: '12px' }}>
                      Auto-calculated from MP3
                    </small>
                  </div>
                  {/* Remove song button - only show if there's more than one song */}
                  {songs.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSong(index)} 
                      className="btn-danger btn-small"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {/* File inputs for MP3 and song cover */}
                <div className="song-file-inputs">
                  {/* MP3 file upload - required */}
                  <div className="input-field">
                    <label>MP3 File: *</label>
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp3,.mp3"
                      required
                      onChange={(e) => handleSongMP3Change(index, e.target.files[0])}
                    />
                    {/* Show file info if MP3 was selected */}
                    {song.mp3File && (
                      <div className="file-info">
                        <span>✓ {song.mp3File.name}</span>
                        <span>{(song.mp3File.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>
                  {/* Song cover image upload - optional */}
                  <div className="input-field">
                    <label>Song Cover Image (optional):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSongCoverImgChange(index, e.target.files[0])}
                    />
                    {/* Show preview if image was selected */}
                    {song.coverImgPreview && (
                      <div className="image-preview-small">
                        <img src={song.coverImgPreview} alt="Song cover preview" />
                        <button 
                          type="button" 
                          onClick={() => {
                            handleSongChange(index, 'coverImg', null);
                            handleSongChange(index, 'coverImgPreview', null);
                          }}
                          className="btn-danger btn-small"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show upload progress or success message */}
          {uploadProgress && (
            <div className={error ? "error-message" : "success-message"}>
              {uploadProgress}
            </div>
          )}

          {/* Form action buttons */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Album'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/my-albums')}
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

export default CreateAlbum;
