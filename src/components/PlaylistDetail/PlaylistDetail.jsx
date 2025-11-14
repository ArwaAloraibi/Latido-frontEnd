const PlaylistDetail = (props) => {
  if (!props.selectedPlaylist) {
    return (
      <div>
        <h2>No playlist selected. Please select a playlist to view details.</h2>
      </div>
    );
  }

  const playlist = props.selectedPlaylist;

  return (
    <div>
      <h1>Playlist Details</h1>
      
      <div>
        <h2>{playlist.name}</h2>
        {playlist.listener && <p> {playlist.listener}</p>}
        
        {playlist.songs && playlist.songs.length > 0 && (
          <div>
            <h3>Songs:</h3>
            <ul>
              {playlist.songs.map((song, index) => (
                <li key={song._id || index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <div>{song.name}</div>
                    {song.duration && <small style={{ color: '#888' }}>{song.duration}</small>}
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
export default PlaylistDetail;