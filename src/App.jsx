// src/App.jsx

import { Routes, Route, useParams } from 'react-router'; // Import React Router
import { useState, useEffect, useContext } from 'react';
import * as albumService from './services/albumService';
import * as playlistService from './services/playlistService';
import * as songService from './services/songService';
import AlbumDetail from './components/AlbumDetail/AlbumDetail';
import PlaylistDetail from './components/PlaylistDetail/PlaylistDetail';
import SongDetail from './components/SongDetail/SongDetail';
import PlaylistList from './components/PlaylistList/PlaylistList'; // Import PlaylistList
import CreatePlaylist from './components/CreatePlaylist/CreatePlaylist'; // Import CreatePlaylist

import NavBar from './components/NavBar/NavBar';
// Import the SignUpForm component
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import { UserContext } from './contexts/UserContext';
import AlbumList from './components/AlbumList/AlbumList';
import SongList from './components/SongList/SongList';

const PlaylistDetailWrapper = ({ playlists }) => {
  const { playlistId } = useParams();
  const selectedPlaylist = playlists.find((p) => p._id === playlistId);
  return <PlaylistDetail selectedPlaylist={selectedPlaylist} />;
};

const App = () => {
  const { user } = useContext(UserContext);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null)


useEffect(() => {
    const fetchAlbums = async () => {
   try{ 
    const fetchedAlbums = await albumService.index();
      if (fetchedAlbums.err) {
          throw new Error(fetchedAlbums.err);
      }
      setAlbums(fetchedAlbums);
    }catch (err){
    console.log(err);
    }
  };
    fetchAlbums();
  }, []);

useEffect(() => {
    const fetchplaylists = async () => {
   try{ 
    const fetchedplaylists = await playlistService.index();
      if (fetchedplaylists.err) {
          throw new Error(fetchedplaylists.err);
      }
      setPlaylists(fetchedplaylists);
    }catch (err){
    console.log(err);
    }
  };
    fetchplaylists();
  }, []);

useEffect(() => {
    const fetchsongs = async () => {
   try{ 
    const fetchedsongs = await songService.index();
      if (fetchedsongs.err) {
          throw new Error(fetchedsongs.err);
      }
      setSongs(fetchedsongs);
    }catch (err){
    console.log(err);
    }
  };
    fetchsongs();
  }, []);


 const handleSelectAlbum = (album) => {
    setSelectedAlbum(album)
  }

  const handleSelectPlaylist =(playlist)=>{
    setSelectedPlaylist(playlist)
  }

  const handleSelectSong  =(song)=>{
      setSelectedSong(song)

  }

  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/albums' element={<AlbumList albums={albums} handleSelectAlbum={handleSelectAlbum}/>}/>
            <Route path='/albums/:albumId' element={<AlbumDetail selectedAlbum={selectedAlbum}/>}/>
            <Route path='/playlists' element={<PlaylistList playlists={playlists} handleSelectPlaylist={handleSelectPlaylist} />}/>
            <Route path='/playlists/create' element={<CreatePlaylist />} />
            <Route path='/playlists/:playlistId' element={<PlaylistDetail selectedPlaylist={selectedPlaylist}/>}/>
            <Route path='/songs' element={<SongList songs={songs} handleSelectSong={handleSelectSong} />}/>
            <Route path='/songs/:songId' element={<SongDetail selectedSong={selectedSong}/>}/>
            <Route path='/profile' element={<h1>{user.username}</h1>}/>
            <Route path='/playlists/:playlistId' element={<PlaylistDetailWrapper playlists={playlists} />} />
            
          </>
            :
            <Route path='/' element={<Landing/>}/>
        }
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;
