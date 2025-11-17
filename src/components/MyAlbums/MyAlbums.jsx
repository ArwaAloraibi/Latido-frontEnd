// MyAlbums component - shows all albums created by the current artist
// Only visible to users with artist role

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";

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


  // Handle edit button click
  const handleEditClick = (e, albumId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    navigate(`/my-albums/${albumId}/edit`);
  };

  // Handle view button click
  const handleViewClick = (e, album) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    navigate(`/albums/${album._id}`);
  };

  // Navigate to album detail page when album is clicked
  // But only if the click wasn't on a button
  const handleAlbumClick = (e, album) => {
    // Check if the click was on a button or inside a button container
    const target = e.target;
    if (target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('.btn-primary') || 
        target.closest('.btn-secondary')) {
      return; // Don't navigate if clicking a button
    }
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
              <div 
                key={album._id} 
                className="card" 
                onClick={(e) => handleAlbumClick(e, album)}
                style={{ cursor: 'pointer' }}
              >
                {/* Album cover image */}
                {album.coverImg && (
                  <img src={album.coverImg} alt={album.name} />
                )}
                {/* Album name */}
                <h3>{album.name}</h3>
                {/* Show song count and total duration */}
                <p>{songCount} {songCount === 1 ? 'song' : 'songs'}</p>
                <p>Duration: {formatDuration(totalDuration)}</p>
                {/* Action buttons container - completely isolated from card click */}
                <div 
                  style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation();
                    }
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button 
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewClick(e, album);
                    }} 
                    className="btn-primary"
                  >
                    View
                  </button>
                  <button 
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditClick(e, album._id);
                    }} 
                    className="btn-secondary"
                  >
                    Edit
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
