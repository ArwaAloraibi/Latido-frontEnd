import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

const AlbumDetail = ({ selectedAlbum, playlists, onAddSongToPlaylist, onAlbumUpdate }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!selectedAlbum) {
    return (
      <div className="main">
        <h2>Album not found or loading...</h2>
        <p>Please go to <a href="/discover" style={{ color: "#c0a3ff" }}>Discover</a> to browse albums.</p>
        {user && (user.roles === 'artist' || user.role === 'artist') && (
          <p>Or go to <a href="/my-albums" style={{ color: "#c0a3ff" }}>My Albums</a> to view your albums.</p>
        )}
      </div>
    );
  }

  // Ensure songs are objects (handle both populated and unpopulated cases)
  const songs = selectedAlbum.songs || [];
  const populatedSongs = songs.map((song) => {
    if (typeof song === 'object' && song._id) {
      return song;
    }
    return null;
  }).filter(Boolean);

  const artistName = selectedAlbum.userId && typeof selectedAlbum.userId === 'object' 
    ? selectedAlbum.userId.username 
    : 'Unknown Artist';

  const isOwner = user && selectedAlbum.userId && (
    typeof selectedAlbum.userId === 'object' 
      ? selectedAlbum.userId._id === user._id 
      : selectedAlbum.userId === user._id
  ) && user.roles === 'artist';

  const toggleSongSelection = (songId) => {
    setSelectedSongIds((prevSelected) =>
      prevSelected.includes(songId)
        ? prevSelected.filter((id) => id !== songId)
        : [...prevSelected, songId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSongIds.length === populatedSongs.length) {
      setSelectedSongIds([]);
    } else {
      setSelectedSongIds(populatedSongs.map((song) => song._id));
    }
  };

  const handleAddClick = async () => {
    if (selectedSongIds.length === 0) {
      setErrorMessage("Please select at least one song to add.");
      setSuccessMessage("");
      return;
    }
    if (!selectedPlaylistId) {
      setErrorMessage("Please select a playlist.");
      setSuccessMessage("");
      return;
    }
    
    setErrorMessage("");
    setSuccessMessage("Adding songs to playlist...");

    const result = await onAddSongToPlaylist(selectedSongIds, selectedPlaylistId);
    
    if (result.success) {
      setSuccessMessage("Songs added to playlist successfully!");
      setSelectedSongIds([]);
      setSelectedPlaylistId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrorMessage(result.error || "Failed to add songs to playlist.");
      setSuccessMessage("");
    }
  };

  const handlePlaySong = (song) => {
    // Track recently played
    const played = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    const updated = [song._id, ...played.filter(id => id !== song._id)].slice(0, 10);
    localStorage.setItem('recentlyPlayed', JSON.stringify(updated));

    // Track recently viewed album
    const viewed = JSON.parse(localStorage.getItem('recentlyViewedAlbums') || '[]');
    const albumId = selectedAlbum._id;
    const updatedViewed = [albumId, ...viewed.filter(id => id !== albumId)].slice(0, 10);
    localStorage.setItem('recentlyViewedAlbums', JSON.stringify(updatedViewed));

    if (currentSong && currentSong._id === song._id && isPlaying) {
      setIsPlaying(false);
      setCurrentSong(null);
    } else {
      // Attach artist information from the album to the song
      const songWithArtist = {
        ...song,
        artist: selectedAlbum.userId || song.artist
      };
      setCurrentSong(songWithArtist);
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotalDuration = () => {
    return populatedSongs.reduce((total, song) => total + (song.duration || 0), 0);
  };

  return (
    <div className="main">
      <h1>Album Details</h1>
      
      <div className="detail-header">
        {selectedAlbum.coverImg && (
          <div className="detail-cover">
            <img src={selectedAlbum.coverImg} alt={selectedAlbum.name} />
          </div>
        )}
        <div className="detail-info">
          <h2>{selectedAlbum.name}</h2>
          <p><strong>Created by:</strong> {artistName}</p>
          <p><strong>Songs:</strong> {populatedSongs.length}</p>
          <p><strong>Duration:</strong> {formatDuration(calculateTotalDuration())}</p>
        </div>
      </div>

      {populatedSongs.length > 0 ? (
        <div className="songs-section">
          <div className="songs-header">
            <h3>Songs</h3>
            <button onClick={toggleSelectAll} className="btn-secondary">
              {selectedSongIds.length === populatedSongs.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <ul className="song-list">
            {populatedSongs.map((song) => (
              <li key={song._id} className="song-item">
                <input
                  type="checkbox"
                  checked={selectedSongIds.includes(song._id)}
                  onChange={() => toggleSongSelection(song._id)}
                />
                {song.coverImg && (
                  <img src={song.coverImg} alt={song.name} />
                )}
                <div className="song-item-info">
                  <strong>{song.name || "Unknown Song"}</strong>
                  <small>Duration: {formatDuration(song.duration)}</small>
                </div>
                <button 
                  onClick={() => handlePlaySong(song)}
                  className="btn-primary"
                >
                  {currentSong && currentSong._id === song._id && isPlaying ? "Pause" : "Play"}
                </button>
              </li>
            ))}
          </ul>

          <div className="playlist-actions">
            <label>Select Playlist to Add Songs:</label>
            <div className="playlist-radio-group">
              {playlists && playlists.length > 0 ? (
                playlists.map((pl) => (
                  <div key={pl._id} className="playlist-radio-item">
                    <input
                      type="radio"
                      name="playlist"
                      value={pl._id}
                      checked={selectedPlaylistId === pl._id}
                      onChange={(e) => setSelectedPlaylistId(e.target.value)}
                    />
                    <label>{pl.name}</label>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--beige)', opacity: 0.8 }}>
                  No playlists available. <a href="/playlists/create">Create one</a>
                </p>
              )}
            </div>
            <button onClick={handleAddClick} className="btn-primary">
              Add Selected Songs to Playlist
            </button>
            {errorMessage && (
              <div className="error-message" style={{ marginTop: '16px' }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="success-message" style={{ marginTop: '16px' }}>
                {successMessage}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--beige)', opacity: 0.8 }}>No songs in this album yet.</p>
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

export default AlbumDetail;
