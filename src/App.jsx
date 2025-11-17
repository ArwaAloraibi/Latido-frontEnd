// src/App.jsx
// This is the main App component that handles routing and manages global state for albums and playlists

import { Routes, Route, useParams } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import * as albumService from './services/albumService';
import * as playlistService from './services/playlistService';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import { UserContext } from './contexts/UserContext';
import AlbumList from './components/AlbumList/AlbumList';
import AlbumDetail from './components/AlbumDetail/AlbumDetail';
import PlaylistList from './components/PlaylistList/PlaylistList';
import PlaylistDetail from './components/PlaylistDetail/PlaylistDetail';
import CreatePlaylist from './components/CreatePlaylist/CreatePlaylist';
import CreateAlbum from './components/CreateAlbum/CreateAlbum';
import EditAlbum from './components/EditAlbum/EditAlbum';
import MyAlbums from './components/MyAlbums/MyAlbums';
import './App.css';

// Wrapper component to pass the selected playlist to PlaylistDetail
// We need this because we get the playlistId from the URL params
const PlaylistDetailWrapper = ({ playlists, albums, onPlaylistUpdate }) => {
  const { playlistId } = useParams();
  // Find the playlist that matches the ID from the URL
  const selectedPlaylist = playlists.find((p) => p._id === playlistId);
  return <PlaylistDetail selectedPlaylist={selectedPlaylist} albums={albums} onPlaylistUpdate={onPlaylistUpdate} />;
};

// Wrapper component to pass the selected album to AlbumDetail
// Same idea as above - we get albumId from URL and find the matching album
const AlbumDetailWrapper = ({ albums, playlists, onAlbumUpdate, onAddSongToPlaylist }) => {
  const { albumId } = useParams();
  const selectedAlbum = albums.find((a) => a._id === albumId);
  return <AlbumDetail selectedAlbum={selectedAlbum} playlists={playlists} onAddSongToPlaylist={onAddSongToPlaylist} onAlbumUpdate={onAlbumUpdate} />;
};

const App = () => {
  // Get the current user from context - this tells us if someone is logged in
  const { user } = useContext(UserContext);
  
  // State to store all albums and playlists
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  
  // Loading state to show spinner while fetching data
  const [loading, setLoading] = useState(true);
  
  // Error state to display error messages if something goes wrong
  const [error, setError] = useState(null);

  // Fetch albums and playlists when user logs in
  // We use useEffect so it runs when the component mounts or when user changes
  useEffect(() => {
    // If no user is logged in, clear the data and stop loading
    if (!user) {
      setAlbums([]);
      setPlaylists([]);
      setLoading(false);
      return;
    }

    // Async function to fetch data from the backend
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both albums and playlists at the same time using Promise.all
        // This is faster than fetching them one after another
        const [fetchedAlbums, fetchedPlaylists] = await Promise.all([
          albumService.index(),
          playlistService.index()
        ]);
        
        // Check if there were any errors in the response
        if (fetchedAlbums.err) throw new Error(fetchedAlbums.err);
        if (fetchedPlaylists.err) throw new Error(fetchedPlaylists.err);

        // Only show playlists that belong to the current user
        // The listener field can be an object or just an ID, so we check both
        const userPlaylists = fetchedPlaylists.filter(
          (pl) => pl.listener && (typeof pl.listener === 'object' ? pl.listener._id === user._id : pl.listener === user._id)
        );

        // Update state with the fetched data
        setAlbums(fetchedAlbums);
        setPlaylists(userPlaylists);
      } catch (err) {
        // If something goes wrong, show the error message
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        // Always set loading to false when we're done
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // This effect runs whenever the user changes

  // Function to add songs to a playlist
  // Takes an array of song IDs and a playlist ID
  const handleAddSongToPlaylist = async (songIds, playlistId) => {
    try {
      // Find the playlist we want to update
      const playlist = playlists.find((pl) => pl._id === playlistId);
      if (!playlist) throw new Error('Playlist not found');

      // Get all the song IDs that are already in the playlist
      // Songs can be objects or just IDs, so we handle both
      const currentSongIds = playlist.songs.map((s) => 
        typeof s === 'object' ? s._id : s
      );

      // Combine old and new song IDs, but remove duplicates using Set
      const newSongIds = [...new Set([...currentSongIds, ...songIds])];

      // Send the update to the backend
      const updated = await playlistService.update(playlistId, { songs: newSongIds });
      
      if (updated.err) throw new Error(updated.err);

      // Refresh the playlists to get the updated data
      const fetchedPlaylists = await playlistService.index();
      const userPlaylists = fetchedPlaylists.filter(
        (pl) => pl.listener && (typeof pl.listener === 'object' ? pl.listener._id === user._id : pl.listener === user._id)
      );
      setPlaylists(userPlaylists);
      
      return { success: true };
    } catch (err) {
      console.error('Error adding songs to playlist:', err);
      return { success: false, error: err.message };
    }
  };

  // Function to refresh playlists after they're updated
  // This is called when a playlist is created, updated, or deleted
  const handlePlaylistUpdate = async () => {
    try {
      const fetchedPlaylists = await playlistService.index();
      const userPlaylists = fetchedPlaylists.filter(
        (pl) => pl.listener && (typeof pl.listener === 'object' ? pl.listener._id === user._id : pl.listener === user._id)
      );
      setPlaylists(userPlaylists);
    } catch (err) {
      console.error('Error updating playlists:', err);
    }
  };

  // Function to refresh albums after they're updated
  // Called when an album is created, updated, or deleted
  const handleAlbumUpdate = async () => {
    try {
      const fetchedAlbums = await albumService.index();
      if (fetchedAlbums.err) throw new Error(fetchedAlbums.err);
      setAlbums(fetchedAlbums);
    } catch (err) {
      console.error('Error updating albums:', err);
    }
  };

  return (
    <>
      {/* Navigation bar that shows on every page */}
      <NavBar />
      
      {/* Display error message at the top if there's an error */}
      {error && (
        <div style={{ padding: '10px', background: 'rgba(255, 0, 0, 0.1)', color: '#ff6b6b', textAlign: 'center' }}>
          {error}
        </div>
      )}
      
      {/* All the routes for different pages */}
      <Routes>
        {user ? (
          <>
            {/* Dashboard - shows when user is logged in */}
            <Route path='/' element={<Dashboard />} />
            
            {/* Discover page - shows all albums */}
            <Route 
              path='/discover' 
              element={<AlbumList albums={albums} loading={loading} onAlbumUpdate={handleAlbumUpdate} />} 
            />
            
            {/* Old /albums route redirects to discover for backwards compatibility */}
            <Route 
              path='/albums' 
              element={<AlbumList albums={albums} loading={loading} onAlbumUpdate={handleAlbumUpdate} />} 
            />
            
            {/* Album detail page - shows songs in an album */}
            <Route 
              path='/albums/:albumId' 
              element={
                <AlbumDetailWrapper 
                  albums={albums} 
                  playlists={playlists} 
                  onAddSongToPlaylist={handleAddSongToPlaylist}
                  onAlbumUpdate={handleAlbumUpdate}
                />
              } 
            />
            
            {/* Only show these routes if user is an artist */}
            {(() => {
              // Check if user has artist role - handle different possible field names
              const userRoles = user?.roles || user?.role || user?.user?.roles || user?.user?.role;
              return userRoles === 'artist';
            })() && (
              <>
                {/* My Albums page - shows only albums created by this artist */}
                <Route 
                  path='/my-albums' 
                  element={<MyAlbums albums={albums} onAlbumUpdate={handleAlbumUpdate} />} 
                />
                
                {/* Create new album page */}
                <Route 
                  path='/my-albums/create' 
                  element={<CreateAlbum onAlbumUpdate={handleAlbumUpdate} />} 
                />
                
                {/* Edit existing album page */}
                <Route 
                  path='/my-albums/:albumId/edit' 
                  element={<EditAlbum albums={albums} onAlbumUpdate={handleAlbumUpdate} />} 
                />
                
                {/* Old route redirects to new create album page */}
                <Route 
                  path='/albums/new' 
                  element={<CreateAlbum onAlbumUpdate={handleAlbumUpdate} />} 
                />
              </>
            )}
            
            {/* Playlists page - shows user's playlists */}
            <Route 
              path='/playlists' 
              element={<PlaylistList playlists={playlists} loading={loading} onPlaylistUpdate={handlePlaylistUpdate} />} 
            />
            
            {/* Create new playlist page */}
            <Route 
              path='/playlists/create' 
              element={<CreatePlaylist onPlaylistUpdate={handlePlaylistUpdate} />} 
            />
            
            {/* Playlist detail page - shows songs in a playlist */}
            <Route 
              path='/playlists/:playlistId' 
              element={<PlaylistDetailWrapper playlists={playlists} albums={albums} onPlaylistUpdate={handlePlaylistUpdate} />} 
            />
            
            {/* Profile page - simple for now */}
            <Route path='/profile' element={<h1>{user.username}</h1>} />
          </>
        ) : (
          // If not logged in, show landing page
          <Route path='/' element={<Landing />} />
        )}
        
        {/* Sign up and sign in pages - available to everyone */}
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;
