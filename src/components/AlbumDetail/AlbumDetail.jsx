import { useState } from 'react';

const AlbumDetail = (props) => {
  const { selectedAlbum, playlists, onAddSongToPlaylist } = props;
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  if (!selectedAlbum) {
    return (
      <div>
        <h2>No album selected. Please select an album to view details.</h2>
      </div>
    );
  }
  
  const handleAddClick = () => {
    if (selectedSongId && selectedPlaylistId) {
      const song = selectedAlbum.songs.find(song => song._id === selectedSongId);
      const playlist = playlists.find(pl => pl._id === selectedPlaylistId);
      if (song && playlist) {
        onAddSongToPlaylist(song, playlist);
        alert(`Added "${song.name}" to playlist "${playlist.name}"`);
        setSelectedSongId(null);
        setSelectedPlaylistId(null);
      }
    } else {
      alert("Please select both a song and a playlist to add.");
    }
  };

  return (
    <div>
      <h1>Album Details</h1>
      <div>
        <h2>{selectedAlbum.name}</h2>
        {selectedAlbum.artist && <p><strong>Artist:</strong> {selectedAlbum.artist}</p>}
        {selectedAlbum.coverImg && (
          <img
            src={selectedAlbum.coverImg}
            alt={selectedAlbum.name}
            style={{ maxWidth: "300px" }}
          />
        )}

        {selectedAlbum.songs && selectedAlbum.songs.length > 0 && (
          <div>
            <h3>Songs:</h3>
            <ul>
              {selectedAlbum.songs.map((song, index) => (
                <li
                  key={song._id || index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {song.coverImg && (
                    <img
                      src={song.coverImg}
                      alt={song.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div><strong>{song.name}</strong></div>
                    {song.artist && <div><small style={{ color: "#555" }}>Artist: {song.artist}</small></div>}
                    {song.duration && <div><small style={{ color: "#888" }}>Duration: {song.duration} min</small></div>}
                  </div>
                  <input
                    type="radio"
                    name="selectedSong"
                    checked={selectedSongId === song._id}
                    onChange={() => setSelectedSongId(song._id)}
                  />
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "10px" }}>
              <label htmlFor="playlistSelect">Select Playlist:</label>
              <select
                id="playlistSelect"
                value={selectedPlaylistId || ""}
                onChange={(e) => setSelectedPlaylistId(e.target.value)}
              >
                <option value="" disabled>Select a playlist</option>
                {playlists && playlists.length > 0 ? (
                  playlists.map((pl) => (
                    <option key={pl._id} value={pl._id}>{pl.name}</option>
                  ))
                ) : (
                  <option disabled>No playlists available</option>
                )}

              </select>
              <button onClick={handleAddClick} style={{ marginLeft: "10px" }}>
                Add to Playlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
