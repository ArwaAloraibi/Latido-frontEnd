import { useNavigate } from "react-router";

const PlaylistList = ({ playlists, loading, onPlaylistUpdate }) => {
  const navigate = useNavigate();

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="main">
        <h1>My Playlists</h1>
        <div className="loading-text">
          <div className="loading"></div>
          <span>Loading playlists...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="page-header">
        <h1>My Playlists</h1>
        <button onClick={() => navigate('/playlists/create')} className="btn-primary">
          Create New Playlist
        </button>
      </div>

      <div className="card-container">
        {!playlists || playlists.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
            <h2 style={{ marginBottom: '24px', color: 'var(--beige)' }}>No playlists yet!</h2>
            <button onClick={() => navigate('/playlists/create')} className="btn-primary">
              Create Your First Playlist
            </button>
          </div>
        ) : (
          playlists.map((playlist) => {
            const songCount = playlist.songs ? playlist.songs.length : 0;
            const songs = playlist.songs || [];
            const totalDuration = songs.reduce((total, song) => {
              const duration = typeof song === 'object' ? song.duration : 0;
              return total + (duration || 0);
            }, 0);

            return (
              <div key={playlist._id} className="card" onClick={() => navigate(`/playlists/${playlist._id}`)}>
                {playlist.coverImg && (
                  <img src={playlist.coverImg} alt={playlist.name} />
                )}
                <h3>{playlist.name || "Unnamed Playlist"}</h3>
                <p>{songCount} {songCount === 1 ? 'song' : 'songs'}</p>
                <p>Duration: {formatDuration(totalDuration)}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlaylistList;
