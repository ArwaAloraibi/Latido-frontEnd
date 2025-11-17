// NavBar component - navigation bar that shows on every page
// Shows different links based on whether user is logged in and their role

import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  // Get user data and setUser function from context
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle sign out - clear token and reset user state
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Check if user is an artist
  // The roles field might be in different places depending on how the token was created
  // So we check multiple possible locations
  const userRoles = user?.roles || user?.role || user?.user?.roles || user?.user?.role;
  const isArtist = userRoles === 'artist';

  return (
    <nav>
      {user ? (
        // Navigation for logged-in users
        <ul>
          <li className="nav-welcome">Welcome, {user.username}</li>
          <li><Link to='/'>Dashboard</Link></li>
          <li><Link to='/discover'>Discover</Link></li>
          {/* Only show My Albums link if user is an artist */}
          {isArtist && (
            <li><Link to='/my-albums'>My Albums</Link></li>
          )}
          <li><Link to='/playlists'>Playlists</Link></li>
          <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
      ) : (
        // Navigation for guests (not logged in)
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/sign-up'>Sign Up</Link></li>
          <li><Link to='/sign-in'>Sign In</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
