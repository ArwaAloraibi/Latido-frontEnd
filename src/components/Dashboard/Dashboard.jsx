// Dashboard component - shows personalized content when user logs in
// Displays recently viewed albums and recently played songs

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as albumService from '../../services/albumService';
import * as playlistService from '../../services/playlistService';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // State to store recently viewed albums and played songs
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data when component mounts
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all albums and playlists to get the data we need
        const [albums, playlists] = await Promise.all([
          albumService.index(),
          playlistService.index()
        ]);

        // Collect all songs from all albums so we can match them with recently played
        const allSongs = [];
        albums.forEach(album => {
          if (album.songs && album.songs.length > 0) {
            album.songs.forEach(song => {
              // Only add songs that are actual objects with IDs
              if (typeof song === 'object' && song._id) {
                allSongs.push({ ...song, albumName: album.name, albumId: album._id });
              }
            });
          }
        });

        // Get list of recently played song IDs from localStorage
        // localStorage stores data in the browser, so it persists between sessions
        const playedSongs = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
        // Match the IDs with actual song objects and get the 5 most recent
        const recentPlayed = playedSongs
          .map(songId => allSongs.find(s => s._id === songId))
          .filter(Boolean) // Remove any undefined values
          .slice(0, 5); // Only show 5 most recent

        // Get list of recently viewed album IDs from localStorage
        const viewedAlbums = JSON.parse(localStorage.getItem('recentlyViewedAlbums') || '[]');
        // Match IDs with actual album objects and get the 5 most recent
        const recentViewed = viewedAlbums
          .map(albumId => albums.find(a => a._id === albumId))
          .filter(Boolean)
          .slice(0, 5);

        // Update state with the data we found
        setRecentAlbums(recentViewed);
        setRecentSongs(recentPlayed);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only load data if user is logged in
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // When user clicks on an album, save it to recently viewed
  const handleAlbumClick = (albumId) => {
    // Get current list from localStorage
    const viewed = JSON.parse(localStorage.getItem('recentlyViewedAlbums') || '[]');
    // Add this album to the front, remove duplicates, and keep only 10
    const updated = [albumId, ...viewed.filter(id => id !== albumId)].slice(0, 10);
    localStorage.setItem('recentlyViewedAlbums', JSON.stringify(updated));
    // Navigate to the album detail page
    navigate(`/albums/${albumId}`);
  };

  // When user clicks on a song, save it to recently played
  const handleSongClick = (song) => {
    // Get current list from localStorage
    const played = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    // Add this song to the front, remove duplicates, and keep only 10
    const updated = [song._id, ...played.filter(id => id !== song._id)].slice(0, 10);
    localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
    // Navigate to the album that contains this song
    if (song.albumId) {
      navigate(`/albums/${song.albumId}`);
    }
  };

  // Helper function to format duration from seconds to mm:ss
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="main">
        <div className="loading-text">
          <div className="loading"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <h1>Welcome back, {user?.username}!</h1>
      
      {/* Grid layout for the three dashboard sections */}
      <div className="dashboard-grid">
        {/* Section showing recently viewed albums */}
        <div className="dashboard-section">
          <h2>Recently Viewed Albums</h2>
          {recentAlbums.length > 0 ? (
            <div>
              {recentAlbums.map((album) => (
                <div key={album._id} className="recent-item" onClick={() => handleAlbumClick(album._id)}>
                  {album.coverImg && (
                    <img src={album.coverImg} alt={album.name} />
                  )}
                  <div className="recent-item-info">
                    <h4>{album.name}</h4>
                    <p>
                      {/* Show artist name if available */}
                      {album.userId && typeof album.userId === 'object' 
                        ? `By ${album.userId.username}` 
                        : 'Unknown Artist'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--beige)', opacity: 0.7 }}>
              No recently viewed albums. <a href="/discover" onClick={(e) => { e.preventDefault(); navigate('/discover'); }}>Discover albums</a>
            </p>
          )}
        </div>

        {/* Section showing recently played songs */}
        <div className="dashboard-section">
          <h2>Recently Played</h2>
          {recentSongs.length > 0 ? (
            <div>
              {recentSongs.map((song) => (
                <div key={song._id} className="recent-item" onClick={() => handleSongClick(song)}>
                  {song.coverImg && (
                    <img src={song.coverImg} alt={song.name} />
                  )}
                  <div className="recent-item-info">
                    <h4>{song.name}</h4>
                    <p>{song.albumName} • {formatDuration(song.duration)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--beige)', opacity: 0.7 }}>
              No recently played songs. Start listening to discover your favorites!
            </p>
          )}
        </div>

        {/* Quick action buttons for common tasks */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button onClick={() => navigate('/discover')} className="btn-primary" style={{ width: '100%' }}>
              Discover Albums
            </button>
            <button onClick={() => navigate('/playlists')} className="btn-secondary" style={{ width: '100%' }}>
              My Playlists
            </button>
            {/* Only show My Albums button if user is an artist */}
            {(user?.roles === 'artist' || user?.role === 'artist') && (
              <button onClick={() => navigate('/my-albums')} className="btn-secondary" style={{ width: '100%' }}>
                My Albums
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
