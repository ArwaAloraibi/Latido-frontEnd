// src/App.jsx

import { Routes, Route } from 'react-router'; 
import { useState, useEffect, useContext } from 'react';

import * as albumService from './services/albumService';
import * as playlistService from './services/playlistService';
import * as songService from './services/songService';

import AlbumDetail from './components/AlbumDetail/AlbumDetail';
import PlaylistDetail from './components/PlaylistDetail/PlaylistDetail';
import SongDetail from './components/SongDetail/SongDetail';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import { UserContext } from './contexts/UserContext';
import AlbumList from './components/AlbumList/AlbumList';
import SongList from './components/SongList/SongList';

import PlaylistList from './components/PlaylistList/PlaylistList'; // Import PlaylistList
import CreatePlaylist from './components/CreatePlaylist/CreatePlaylist'; // Import CreatePlaylist

const App = () => {
  const { user } = useContext(UserContext);

  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const fetchedAlbums = await albumService.index();
        if (fetchedAlbums.err) throw new Error(fetchedAlbums.err);
        setAlbums(fetchedAlbums);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const fetchedPlaylists = await playlistService.index();
        if (fetchedPlaylists.err) throw new Error(fetchedPlaylists.err);
        setPlaylists(fetchedPlaylists);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const fetchedSongs = await songService.index();
        if (fetchedSongs.err) throw new Error(fetchedSongs.err);
        setSongs(fetchedSongs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSongs();
  }, []);

  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
  };

  return (
    <>
      <NavBar />

      <Routes>
        {user ? (
          <>
            <Route path='/' element={<Dashboard />} />
            
            <Route
              path='/albums'
              element={<AlbumList albums={albums} handleSelectAlbum={handleSelectAlbum} />}
            />
            <Route
              path='/playlists'
              element={<PlaylistList playlists={playlists} handleSelectPlaylist={handleSelectPlaylist} />}
            />
            {/* Add route for creating playlist */}
            <Route path='/playlists/create' element={<CreatePlaylist />} />

            <Route
              path='/songs'
              element={<SongList songs={songs} handleSelectSong={handleSelectSong} />}
            />
            <Route
              path='/albums/detail'
              element={<AlbumDetail albums={albums} selectedAlbum={selectedAlbum} />}
            />
            <Route
              path='/playlists/detail'
              element={<PlaylistDetail playlists={playlists} selectedPlaylist={selectedPlaylist} />}
            />
            <Route
              path='/songs/detail'
              element={<SongDetail songs={songs} selectedSong={selectedSong} />}
            />

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
