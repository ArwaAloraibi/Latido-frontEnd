// src/components/Landing.jsx

import { useNavigate } from 'react-router';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <div className="landing-content">
        <h1>Welcome to Latido</h1>
        <p className="landing-subtitle">Your music streaming platform</p>
        <div className="features">
          <div className="feature-card" onClick={() => navigate('/sign-up')}>
            <h3>Discover Music</h3>
            <p>Explore albums from artists around the world</p>
          </div>
          <div className="feature-card" onClick={() => navigate('/sign-up')}>
            <h3>Create Playlists</h3>
            <p>Build your perfect music collection</p>
          </div>
          <div className="feature-card" onClick={() => navigate('/sign-in')}>
            <h3>Stream Anywhere</h3>
            <p>Listen to your favorite songs anytime</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
