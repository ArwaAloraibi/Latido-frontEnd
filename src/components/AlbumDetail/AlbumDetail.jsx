const AlbumDetail = (props) => {
  if (!props.selectedAlbum) {
    return (
      <div>
        <h2>No album selected. Please select an album to view details.</h2>
      </div>
    );
  }

  const album = props.selectedAlbum;

  return (
    <div>
      <h1>Album Details</h1>
      
      <div>
        <h2>{album.name}</h2>
        {album.artist && <p><strong>Artist:</strong> {album.artist}</p>}
        {album.coverImg && <img src={album.coverImg} alt={album.name} style={{ maxWidth: '300px' }} />}
        
        {album.songs && album.songs.length > 0 && (
          <div>
            <h3>Songs:</h3>
            <ul>
                  {album.songs.map((song, index) => (
                    <li key={song._id || index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      {song.coverImg && (
                        <img 
                          src={song.coverImg} 
                          alt={song.name} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                      )}
                      <div>
                        <div><strong>{song.name}</strong></div>
                        {song.artist && <div><small style={{ color: '#555' }}>Artist: {song.artist}</small></div>}
                        {song.duration && <div><small style={{ color: '#888' }}>Duration: {song.duration} min</small></div>}
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
export default AlbumDetail;