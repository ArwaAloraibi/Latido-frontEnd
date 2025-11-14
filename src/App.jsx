// src/App.jsx

import { Routes, Route } from 'react-router'; // Import React Router
import { useState, useEffect, useContext } from 'react';
import * as albumService from './services/albumService';
import * as playlistService from './services/playlistService';
import * as songService from './services/songService';



import NavBar from './components/NavBar/NavBar';
// Import the SignUpForm component
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import { UserContext } from './contexts/UserContext';
import AlbumList from './components/AlbumList/AlbumList';



const App = () => {
  const { user } = useContext(UserContext);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);



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




  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/albums' element={<AlbumList albums={albums} />}/>
            <Route path='/playlists' element={<PlaylistList playlists={playlists} />}/>
            <Route path='/songs' element={<SongList songs={songs} />}/>
            <Route path='/products' element={<h1>Producs</h1>}/>
            <Route path='/favs' element={<h1>Favs</h1>}/>
            <Route path='/profile' element={<h1>{user.username}</h1>}/>
            <Route path='/orders' element={<h1>ORDERS</h1>}/>
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

