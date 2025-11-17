import { useNavigate } from 'react-router';

const AlbumList = ({ albums, loading, onAlbumUpdate }) => {
  const navigate = useNavigate();

  const handleAlbumClick = (album) => {
    // Track recently viewed album
    const viewed = JSON.parse(localStorage.getItem('recentlyViewedAlbums') || '[]');
    const updated = [album._id, ...viewed.filter(id => id !== album._id)].slice(0, 10);
    localStorage.setItem('recentlyViewedAlbums', JSON.stringify(updated));
    navigate(`/albums/${album._id}`);
  };

  // Calculate total duration for an album
  const calculateAlbumDuration = (album) => {
    if (!album.songs || album.songs.length === 0) return 0;
    return album.songs.reduce((total, song) => {
      const duration = typeof song === 'object' ? song.duration : 0;
      return total + (duration || 0);
    }, 0);
  };

  // Format duration in mm:ss
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="main">
        <h1>Discover Albums</h1>
        <div className="loading-text">
          <div className="loading"></div>
          <span>Loading albums...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <h1>Discover Albums</h1>
      <div className="card-container">
        {!albums || albums.length === 0 ? (
          <h2>No Albums Yet!</h2>
        ) : (
          albums.map((album) => {
            const songCount = album.songs ? album.songs.length : 0;
            const totalDuration = calculateAlbumDuration(album);
            const artistName = album.userId && typeof album.userId === 'object' 
              ? album.userId.username 
              : 'Unknown Artist';

            return (
              <div key={album._id} className="card" onClick={() => handleAlbumClick(album)}>
                {album.coverImg && (
                  <img src={album.coverImg} alt={album.name} />
                )}
                <h3>{album.name}</h3>
                <p>Created by: {artistName}</p>
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

export default AlbumList;