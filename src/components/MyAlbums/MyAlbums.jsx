// MyAlbums component - shows all albums created by the current artist
// Only visible to users with artist role

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as albumService from "../../services/albumService";

const MyAlbums = ({ albums, onAlbumUpdate }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State to store only the albums created by this user
  const [myAlbums, setMyAlbums] = useState([]);
  
  // Error state for displaying error messages
  const [error, setError] = useState("");

  // Filter albums to show only the ones created by the current user
  useEffect(() => {
    if (albums && user) {
      const filtered = albums.filter(album => 
        album.userId && (
          // userId can be an object or just an ID, so we check both
          typeof album.userId === 'object' 
            ? album.userId._id === user._id 
            : album.userId === user._id
        )
      );
      setMyAlbums(filtered);
    }
  }, [albums, user]);

  // Handle album deletion
  const handleDeleteAlbum = async (albumId) => {
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this album? This will delete all songs in the album.")) {
      return;
    }

    try {
      setError("");
      // Call the delete API
      const result = await albumService.deleteAlbum(albumId);
      
      if (result.err) throw new Error(result.err);
      
      // Refresh the albums list
      if (onAlbumUpdate) onAlbumUpdate();
      // Remove the deleted album from local state
      setMyAlbums(myAlbums.filter(a => a._id !== albumId));
    } catch (err) {
      setError(err.message || "Failed to delete album");
    }
  };

  // Navigate to album detail page when album is clicked
  const handleAlbumClick = (album) => {
    navigate(`/albums/${album._id}`);
  };

  // Calculate total duration of all songs in an album
  const calculateAlbumDuration = (album) => {
    if (!album.songs || album.songs.length === 0) return 0;
    // Sum up all song durations
    return album.songs.reduce((total, song) => {
      const duration = typeof song === 'object' ? song.duration : 0;
      return total + (duration || 0);
    }, 0);
  };

  // Format duration from seconds to mm:ss format
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="main">
      {/* Page header with title and create button */}
      <div className="page-header">
        <h1>My Albums</h1>
        <button onClick={() => navigate('/my-albums/create')} className="btn-primary">
          Create New Album
        </button>
      </div>

      {/* Show error message if deletion failed */}
      {error && (
        <div className="error-message" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Display albums in a grid */}
      <div className="card-container">
        {myAlbums.length === 0 ? (
          // Show message if no albums exist yet
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
            <h2 style={{ marginBottom: '24px', color: 'var(--beige)' }}>You haven't created any albums yet.</h2>
            <button onClick={() => navigate('/my-albums/create')} className="btn-primary">
              Create Your First Album
            </button>
          </div>
        ) : (
          // Map through albums and display each one
          myAlbums.map((album) => {
            const songCount = album.songs ? album.songs.length : 0;
            const totalDuration = calculateAlbumDuration(album);

            return (
              <div key={album._id} className="card">
                {/* Album cover image - clickable to view album */}
                {album.coverImg && (
                  <img src={album.coverImg} alt={album.name} onClick={() => handleAlbumClick(album)} style={{ cursor: 'pointer' }} />
                )}
                {/* Album name - also clickable */}
                <h3 onClick={() => handleAlbumClick(album)} style={{ cursor: 'pointer' }}>{album.name}</h3>
                {/* Show song count and total duration */}
                <p>{songCount} {songCount === 1 ? 'song' : 'songs'}</p>
                <p>Duration: {formatDuration(totalDuration)}</p>
                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleAlbumClick(album)} className="btn-primary">
                    View
                  </button>
                  <button onClick={() => handleDeleteAlbum(album._id)} className="btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyAlbums;
