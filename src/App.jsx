// src/App.jsx

import { Routes, Route, useParams } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import * as albumService from './services/albumService';
import * as playlistService from './services/playlistService';
import * as songService from './services/songService';
import AlbumDetail from './components/AlbumDetail/AlbumDetail';
import PlaylistDetail from './components/PlaylistDetail/PlaylistDetail';
import SongDetail from './components/SongDetail/SongDetail';
import PlaylistList from './components/PlaylistList/PlaylistList';
import CreatePlaylist from './components/CreatePlaylist/CreatePlaylist';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import { UserContext } from './contexts/UserContext';
import AlbumList from './components/AlbumList/AlbumList';
import SongList from './components/SongList/SongList';
import PlaylistDetailWrapper from './components/PlaylistDetailWrapper/PlaylistDetailWrapper';

// // PlaylistDetailWrapper resolves song IDs to full objects using allSongs
// const PlaylistDetailWrapper = ({ playlists, allSongs }) => {
//   const { playlistId } = useParams();
//   const playlist = playlists.find((p) => p._id === playlistId);
//   if (!playlist) return <div>Playlist not found</div>;

//   const populatedPlaylist = {
//     ...playlist,
//     songs: playlist.songs
//       .map(id => allSongs.find(song => song._id === id))
//       .filter(Boolean),
//   };

//   return <PlaylistDetail selectedPlaylist={populatedPlaylist} />;
// };

const App = () => {
  const { user } = useContext(UserContext);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await albumService.index();
        setAlbums(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await playlistService.index();
        setPlaylists(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await songService.index();
        setSongs(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Adds multiple songs to a playlist via backend API, then updates frontend state playlists
  const handleAddSongsToPlaylist = async (songIds, playlist) => {
    try {
      const updatedPlaylist = await playlistService.addSongsToPlaylist(playlist._id, songIds);
      setPlaylists((prev) =>
        prev.map((pl) => (pl._id === updatedPlaylist._id ? updatedPlaylist : pl))
      );
    } catch (error) {
      console.error('Failed to add songs:', error);
    }
  };

  return (
    <>
      <NavBar />
      <Routes>
        {user ? (
          <>
            <Route path='/' element={<Dashboard />} />
            <Route path='/albums' element={<AlbumList albums={albums} handleSelectAlbum={setSelectedAlbum} />} />
            <Route
              path='/albums/:albumId'
              element={
                <AlbumDetail
                  selectedAlbum={selectedAlbum}
                  playlists={playlists}
                  onAddSongsToPlaylist={handleAddSongsToPlaylist}
                />
              }
            />
            <Route path='/playlists' element={<PlaylistList playlists={playlists} />} />
            <Route path='/playlists/create' element={<CreatePlaylist />} />
            <Route path='/playlists/:playlistId' element={<PlaylistDetailWrapper playlists={playlists} allSongs={songs} />} />
            <Route path='/songs' element={<SongList songs={songs} />} />
            <Route path='/songs/:songId' element={<SongDetail selectedSong={selectedSong} />} />
            <Route path='/profile' element={<h1>{user.username}</h1>} />
          </>
        ) : (
          <Route path='/' element={<Landing />} />
        )}
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;
