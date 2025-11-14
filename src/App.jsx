// src/App.jsx
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import * as albumService from './services/albumService';

=======
>>>>>>> afbd6b5549504df274ae1b6c23d06d4e2977fcf9
import { Routes, Route } from 'react-router'; // Import React Router
import { useState, useEffect } from 'react';
import * as albumService from './services/albumService';

import NavBar from './components/NavBar/NavBar';
// Import the SignUpForm component
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';



const App = () => {
  const { user } = useContext(UserContext);
<<<<<<< HEAD
    const [albums, setAlbums] = useState([]);
=======
  const [albums, setAlbums]=useState([]);
   

useEffect(() => {
  const fetchAlbums = async () => {
    const fetchedalbums = await albumService.index();
        setAlbums(fetchedalbums);

  };
  fetchAlbums();
}, []);
>>>>>>> afbd6b5549504df274ae1b6c23d06d4e2977fcf9

useEffect(() => {
    const fetchAlbums = async () => {
   try{ 
    const fetchedAlbums = await albumService.index();
      if (fetchedAlbums.err) {
          throw new Error(fetchedAlbums.err);
      }
      setAlbums(fetchedAlbums);
    }catch (err){

    cpmsole.log(err);
    }
  };
    fetchAlbums();
  }, []);






  
  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
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

