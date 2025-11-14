const SongDetail = (props) => {
  if (!props.selectedSong) {
    return (
      <div>
        <h2>No song selected. Please select a song to view details.</h2>
      </div>
    );
  }

  const song = props.selectedSong;

  return (
    <div>
      <h1>Song Details</h1>
      
      {/* <div>
        <h2>{song.name}</h2>
        {song.artist && <p>{song.artist}</p>}        
        
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
                    <div>{song.name}</div>
                    {song.duration && <small style={{ color: '#888' }}>{song.duration}</small>}
                  </div>
                </li>
              ))}
          </div> */}
       
    </div>
  );
}
export default SongDetail;