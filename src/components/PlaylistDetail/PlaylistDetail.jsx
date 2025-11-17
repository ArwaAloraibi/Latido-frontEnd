import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as playlistService from "../../services/playlistService";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

const PlaylistDetail = ({ selectedPlaylist, onPlaylistUpdate }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverImg, setCoverImg] = useState(null);
  const [coverImgPreview, setCoverImgPreview] = useState(null);

  if (!selectedPlaylist) {
    return (
      <div className="main">
        <h2>Loading playlist...</h2>
      </div>
    );
  }

  // Ensure songs are objects (handle both populated and unpopulated cases)
  const songs = selectedPlaylist.songs || [];
  const populatedSongs = songs.map((song) => {
    if (typeof song === 'object' && song._id) {
      return song;
    }
    return null;
  }).filter(Boolean);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotalDuration = () => {
    return populatedSongs.reduce((total, song) => total + (song.duration || 0), 0);
  };

  const handlePlaySong = (song) => {
    // Track recently played
    const played = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    const updated = [song._id, ...played.filter(id => id !== song._id)].slice(0, 10);
    localStorage.setItem('recentlyPlayed', JSON.stringify(updated));

    if (currentSong && currentSong._id === song._id && isPlaying) {
      setIsPlaying(false);
      setCurrentSong(null);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!window.confirm("Are you sure you want to remove this song from the playlist?")) {
      return;
    }

    try {
      setError("");
      const currentSongIds = populatedSongs
        .map((s) => s._id)
        .filter((id) => id !== songId);

      const updated = await playlistService.update(playlistId, { songs: currentSongIds });
      
      if (updated.err) throw new Error(updated.err);
      
      setSuccess("Song removed from playlist!");
      if (onPlaylistUpdate) onPlaylistUpdate();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to remove song");
    }
  };

  const handleEditName = () => {
    setEditName(selectedPlaylist.name);
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      setError("Playlist name cannot be empty");
      return;
    }

    try {
      setError("");
      const updated = await playlistService.update(playlistId, { name: editName });
      
      if (updated.err) throw new Error(updated.err);
      
      setSuccess("Playlist name updated!");
      setIsEditing(false);
      if (onPlaylistUpdate) onPlaylistUpdate();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update playlist name");
    }
  };

  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }
      setError("");
      setCoverImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCoverImg = async () => {
    if (!coverImg) {
      setError("Please select an image file");
      return;
    }

    try {
      setError("");
      const formData = new FormData();
      formData.append('name', selectedPlaylist.name);
      formData.append('songs', JSON.stringify(populatedSongs.map(s => s._id)));
      formData.append('coverImg', coverImg);

      const updated = await playlistService.updateWithFile(playlistId, formData);
      
      if (updated.err) throw new Error(updated.err);
      
      setSuccess("Cover image updated!");
      setIsEditingCover(false);
      setCoverImg(null);
      setCoverImgPreview(null);
      if (onPlaylistUpdate) onPlaylistUpdate();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update cover image");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      const result = await playlistService.deletePlaylist(playlistId);
      
      if (result.err) throw new Error(result.err);
      
      navigate('/playlists');
    } catch (err) {
      setError(err.message || "Failed to delete playlist");
      setIsDeleting(false);
    }
  };

  return (
    <div className="main">
      <h1>Playlist Details</h1>
      
      <div className="detail-header">
        <div className="detail-cover">
          {(coverImgPreview || selectedPlaylist.coverImg) && (
            <div style={{ position: 'relative' }}>
              <img
                src={coverImgPreview || selectedPlaylist.coverImg}
                alt={selectedPlaylist.name}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
              {isEditingCover && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCover(false);
                    setCoverImg(null);
                    setCoverImgPreview(null);
                  }}
                  className="btn-danger btn-small"
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
          {!isEditingCover ? (
            <button 
              onClick={() => setIsEditingCover(true)} 
              className="btn-secondary"
              style={{ marginTop: '16px', width: '200px' }}
            >
              {selectedPlaylist.coverImg ? 'Change Cover' : 'Add Cover Image'}
            </button>
          ) : (
            <div style={{ marginTop: '16px', width: '200px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImgChange}
                style={{ marginBottom: '10px', width: '100%' }}
              />
              {coverImg && (
                <button 
                  onClick={handleSaveCoverImg} 
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Save Cover
                </button>
              )}
            </div>
          )}
        </div>
        <div className="detail-info">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="form-group input[type='text']"
                style={{ padding: '12px', fontSize: '32px', marginBottom: '16px', width: '100%', background: 'rgba(10, 14, 39, 0.6)', border: '2px solid rgba(255, 0, 255, 0.3)', borderRadius: '12px', color: 'var(--white)' }}
              />
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={handleSaveName} className="btn-primary">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2>{selectedPlaylist.name || "Unnamed Playlist"}</h2>
              <button onClick={handleEditName} className="btn-secondary" style={{ marginTop: '16px' }}>
                Edit Name
              </button>
            </div>
          )}
          <p><strong>Songs:</strong> {populatedSongs.length}</p>
          <p><strong>Duration:</strong> {formatDuration(calculateTotalDuration())}</p>
          <button 
            onClick={handleDeletePlaylist} 
            className="btn-danger"
            disabled={isDeleting}
            style={{ marginTop: '16px' }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Playlist'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" style={{ marginBottom: '24px' }}>
          {success}
        </div>
      )}

      {populatedSongs.length > 0 ? (
        <div className="songs-section">
          <h3>Songs</h3>
          <ul className="song-list">
            {populatedSongs.map((song, idx) => (
              <li key={song._id || idx} className="song-item">
                {song.coverImg && (
                  <img src={song.coverImg} alt={song.name} />
                )}
                <div className="song-item-info">
                  <strong>{song.name || "Unknown Song"}</strong>
                  {song.duration && (
                    <small>{formatDuration(song.duration)}</small>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handlePlaySong(song)}
                    className="btn-primary"
                  >
                    {currentSong && currentSong._id === song._id && isPlaying ? "Pause" : "Play"}
                  </button>
                  <button 
                    onClick={() => handleRemoveSong(song._id)}
                    className="btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ color: 'var(--beige)', opacity: 0.8 }}>
          No songs in this playlist yet. <a href="/discover">Discover albums</a> to add songs!
        </p>
      )}

      {currentSong && (
        <AudioPlayer 
          song={currentSong} 
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={() => {
            setIsPlaying(false);
            setCurrentSong(null);
          }}
        />
      )}
    </div>
  );
};

export default PlaylistDetail;
