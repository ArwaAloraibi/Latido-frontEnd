// EditAlbum component - allows artists to edit their existing albums
// Can update album name, cover image, add new songs, and remove existing songs

import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as albumService from "../../services/albumService";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const EditAlbum = ({ albums, onAlbumUpdate }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { albumId } = useParams();
  
  // State for album data
  const [name, setName] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [coverImgPreview, setCoverImgPreview] = useState(null);
  const [existingCoverImg, setExistingCoverImg] = useState(null);
  
  // State for existing songs (songs already in the album)
  const [existingSongs, setExistingSongs] = useState([]);
  
  // State for new songs being added
  const [newSongs, setNewSongs] = useState([]);
  
  // Error and loading states
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState("");
  
  // Confirmation modal state for removing songs
  const [showRemoveSongConfirm, setShowRemoveSongConfirm] = useState(false);
  const [songToRemove, setSongToRemove] = useState(null);

  // Load album data when component mounts
  // First try to get from props (albums array), then fetch if not found
  useEffect(() => {
    const loadAlbum = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First, try to find album in the albums prop if provided
        let album = null;
        if (albums && Array.isArray(albums) && albums.length > 0) {
          album = albums.find(a => a._id === albumId);
        }
        
        // If not found in props, fetch from API
        if (!album) {
          album = await albumService.show(albumId);
        }
        
        if (album.err) throw new Error(album.err);
        
        console.log('Loaded album data:', album); // Debug log
        
        // Set album name - make sure it's set
        if (album.name) {
          setName(album.name);
          console.log('Set album name to:', album.name); // Debug log
        } else {
          setName("");
        }
        
        // Set existing cover image
        if (album.coverImg) {
          setExistingCoverImg(album.coverImg);
        } else {
          setExistingCoverImg(null);
        }
        
        // Set existing songs - handle both populated objects and IDs
        const songs = album.songs || [];
        console.log('Album songs:', songs); // Debug log
        console.log('Songs type check:', songs.map(s => typeof s)); // Debug log
        
        // If songs are just IDs (strings), we need to fetch them or handle differently
        // For now, let's handle both cases
        const populatedSongs = [];
        
        for (const song of songs) {
          if (typeof song === 'object' && song._id) {
            // Song is already populated
            populatedSongs.push({
              _id: song._id,
              name: song.name || "Unnamed Song",
              duration: song.duration || 0,
              coverImg: song.coverImg || null,
              audioUrl: song.audioUrl || song.file || song.url || null
            });
          } else if (typeof song === 'string') {
            // Song is just an ID - try to find it in albums if available
            let foundSong = null;
            if (albums && Array.isArray(albums)) {
              for (const a of albums) {
                if (a.songs && Array.isArray(a.songs)) {
                  foundSong = a.songs.find(s => 
                    (typeof s === 'object' && s._id === song) || 
                    (typeof s === 'string' && s === song)
                  );
                  if (foundSong && typeof foundSong === 'object') break;
                }
              }
            }
            
            if (foundSong && typeof foundSong === 'object') {
              populatedSongs.push({
                _id: foundSong._id,
                name: foundSong.name || "Unnamed Song",
                duration: foundSong.duration || 0,
                coverImg: foundSong.coverImg || null,
                audioUrl: foundSong.audioUrl || foundSong.file || foundSong.url || null
              });
            } else {
              // Song is just an ID and we can't find it - skip it or show placeholder
              console.warn('Song is just an ID, not populated:', song);
            }
          }
        }
        
        console.log('Populated songs:', populatedSongs); // Debug log
        setExistingSongs(populatedSongs);
      } catch (err) {
        console.error('Error loading album:', err);
        setError(err.message || "Failed to load album");
      } finally {
        setIsLoading(false);
      }
    };

    if (albumId) {
      loadAlbum();
    }
  }, [albumId, albums]);

  // Handle album cover image selection
  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }
      setError(null);
      setCoverImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle new song changes
  const handleNewSongChange = (index, field, value) => {
    const updatedSongs = [...newSongs];
    updatedSongs[index][field] = value;
    setNewSongs(updatedSongs);
  };

  // Handle new song MP3 file selection
  const handleNewSongMP3Change = (index, file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.includes('audio') && !file.name.endsWith('.mp3')) {
      setError(`New song ${index + 1}: Please select a valid MP3 audio file`);
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(`New song ${index + 1}: Audio file size must be less than 10MB`);
      return;
    }
    
    setError(null);
    const updatedSongs = [...newSongs];
    updatedSongs[index].mp3File = file;
    
    // Try to get duration from audio file
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      updatedSongs[index].duration = Math.floor(audio.duration);
      setNewSongs([...updatedSongs]);
      URL.revokeObjectURL(audio.src);
    });
    
    setNewSongs(updatedSongs);
  };

  // Handle new song cover image selection
  const handleNewSongCoverImgChange = (index, file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(`New song ${index + 1}: Please select a valid image file`);
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError(`New song ${index + 1}: Image file size must be less than 2MB`);
      return;
    }
    
    setError(null);
    const updatedSongs = [...newSongs];
    updatedSongs[index].coverImg = file;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      updatedSongs[index].coverImgPreview = reader.result;
      setNewSongs([...updatedSongs]);
    };
    reader.readAsDataURL(file);
  };

  // Add a new song field
  const addNewSong = () => {
    setNewSongs([...newSongs, { name: "", duration: 0, mp3File: null, coverImg: null, coverImgPreview: null }]);
  };

  // Remove a new song field (before submitting)
  const removeNewSong = (index) => {
    setNewSongs(newSongs.filter((_, i) => i !== index));
  };

  // Show confirmation modal for removing a song
  const handleRemoveSongClick = (songId) => {
    setSongToRemove(songId);
    setShowRemoveSongConfirm(true);
  };

  // Remove an existing song from the album after confirmation
  const handleRemoveExistingSong = async () => {
    if (!songToRemove) return;

    try {
      setError("");
      // Get current song IDs, excluding the one to remove
      const currentSongIds = existingSongs
        .map((s) => s._id)
        .filter((id) => id !== songToRemove);

      // Update album with new song list
      const updated = await albumService.update(albumId, { songs: currentSongIds });
      
      if (updated.err) throw new Error(updated.err);
      
      // Remove from local state
      setExistingSongs(existingSongs.filter(s => s._id !== songToRemove));
      
      // Refresh albums
      if (onAlbumUpdate) onAlbumUpdate();
      
      setSongToRemove(null);
    } catch (err) {
      setError(err.message || "Failed to remove song");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setUploadProgress("Preparing update...");

    try {
      // Get IDs of songs to keep (all existing songs)
      const existingSongIds = existingSongs.map(s => s._id);
      
      // Check if we have new songs with files
      const newSongsWithFiles = newSongs.filter(s => s.name.trim() && s.mp3File);
      
      // If we have new songs or cover image, use FormData
      if (newSongsWithFiles.length > 0 || coverImg) {
        const formData = new FormData();
        formData.append('name', name.trim());
        
        // Add existing song IDs
        existingSongIds.forEach((songId, index) => {
          formData.append(`existingSongId_${index}`, songId);
        });
        
        // Add new songs
        newSongsWithFiles.forEach((song, index) => {
          formData.append(`songName_${index}`, song.name.trim());
          formData.append(`songDuration_${index}`, song.duration || 0);
          formData.append(`songMP3_${index}`, song.mp3File);
          if (song.coverImg) {
            formData.append(`songCoverImg_${index}`, song.coverImg);
          }
        });
        
        // Add cover image if changed
        if (coverImg) {
          formData.append('coverImg', coverImg);
        }
        
        setUploadProgress("Updating album...");
        const updated = await albumService.updateWithFiles(albumId, formData);
        
        if (updated.err) throw new Error(updated.err);
      } else {
        // Just update name if no files
        setUploadProgress("Updating album name...");
        const updated = await albumService.update(albumId, { 
          name: name.trim(),
          songs: existingSongIds
        });
        
        if (updated.err) throw new Error(updated.err);
      }

      setUploadProgress("Album updated successfully!");
      if (onAlbumUpdate) onAlbumUpdate();
      setTimeout(() => {
        navigate('/my-albums');
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to update album");
      setUploadProgress("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="main">
        <div className="loading-text">
          <div className="loading"></div>
          <span>Loading album...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="form-container">
        <h2>Edit Album</h2>
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
            <label htmlFor="albumCoverImg">Album Cover Image:</label>
            {existingCoverImg && !coverImgPreview && (
              <div className="image-preview" style={{ marginBottom: '12px' }}>
                <img src={existingCoverImg} alt="Current cover" />
                <p style={{ color: 'var(--beige)', fontSize: '14px', marginTop: '8px' }}>Current cover image</p>
                <small style={{ color: 'var(--beige)', opacity: 0.7, display: 'block', marginTop: '4px' }}>
                  Select a new image below to replace it
                </small>
              </div>
            )}
            <input
              type="file"
              id="albumCoverImg"
              accept="image/*"
              onChange={handleCoverImgChange}
            />
            {coverImgPreview && (
              <div className="image-preview">
                <img src={coverImgPreview} alt="New cover preview" />
                <p style={{ color: 'var(--beige)', fontSize: '14px', marginTop: '8px' }}>New cover image preview</p>
                <button 
                  type="button" 
                  onClick={() => {
                    setCoverImg(null);
                    setCoverImgPreview(null);
                  }}
                  className="btn-danger btn-small"
                  style={{ marginTop: '8px' }}
                >
                  Cancel (Keep Current)
                </button>
              </div>
            )}
          </div>

          {/* Existing songs section */}
          <div className="form-group">
            <label>Existing Songs ({existingSongs.length}):</label>
            {existingSongs.length > 0 ? (
              <div style={{ marginTop: '12px' }}>
                {existingSongs.map((song) => (
                  <div key={song._id} className="song-input-group" style={{ 
                    marginBottom: '16px', 
                    padding: '16px', 
                    background: 'rgba(10, 14, 39, 0.4)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 0, 255, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      {song.coverImg && (
                        <img 
                          src={song.coverImg} 
                          alt={song.name} 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '8px', 
                            objectFit: 'cover',
                            border: '2px solid rgba(255, 0, 255, 0.3)'
                          }} 
                        />
                      )}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <strong style={{ color: 'var(--white)', display: 'block', marginBottom: '4px', fontSize: '16px' }}>
                          {song.name || 'Unnamed Song'}
                        </strong>
                        <small style={{ color: 'var(--beige)', opacity: 0.8, fontSize: '14px' }}>
                          Duration: {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </small>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveSongClick(song._id)}
                        className="btn-danger btn-small"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--beige)', opacity: 0.7, marginTop: '12px' }}>No songs in this album yet. Add new songs below.</p>
            )}
          </div>

          {/* New songs section */}
          <div className="form-group">
            <div className="form-group-header">
              <label>Add New Songs:</label>
              <button type="button" onClick={addNewSong} className="btn-secondary">
                + Add Song
              </button>
            </div>
            {newSongs.map((song, index) => (
              <div key={index} className="song-input-group">
                <div className="song-input-row">
                  <div className="input-field">
                    <label>Song Name: *</label>
                    <input
                      type="text"
                      value={song.name}
                      required
                      onChange={(e) => handleNewSongChange(index, 'name', e.target.value)}
                      placeholder="Enter song name"
                    />
                  </div>
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
                  <button 
                    type="button" 
                    onClick={() => removeNewSong(index)} 
                    className="btn-danger btn-small"
                  >
                    Remove
                  </button>
                </div>
                <div className="song-file-inputs">
                  <div className="input-field">
                    <label>MP3 File: *</label>
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp3,.mp3"
                      required
                      onChange={(e) => handleNewSongMP3Change(index, e.target.files[0])}
                    />
                    {song.mp3File && (
                      <div className="file-info">
                        <span>✓ {song.mp3File.name}</span>
                        <span>{(song.mp3File.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>
                  <div className="input-field">
                    <label>Song Cover Image (optional):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleNewSongCoverImgChange(index, e.target.files[0])}
                    />
                    {song.coverImgPreview && (
                      <div className="image-preview-small">
                        <img src={song.coverImgPreview} alt="Song cover preview" />
                        <button 
                          type="button" 
                          onClick={() => {
                            handleNewSongChange(index, 'coverImg', null);
                            handleNewSongChange(index, 'coverImgPreview', null);
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

          {uploadProgress && (
            <div className={error ? "error-message" : "success-message"}>
              {uploadProgress}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Album'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/my-albums')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>

        {/* Confirmation modal for removing songs */}
        <ConfirmModal
          isOpen={showRemoveSongConfirm}
          onClose={() => {
            setShowRemoveSongConfirm(false);
            setSongToRemove(null);
          }}
          onConfirm={handleRemoveExistingSong}
          title="Remove Song"
          message="Are you sure you want to remove this song from the album? This action cannot be undone."
          confirmText="Remove"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default EditAlbum;

