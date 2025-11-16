import { useState } from "react";

const AlbumDetail = (props) => {
  const { selectedAlbum, playlists, onAddSongToPlaylist } = props;
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!selectedAlbum) {
    return (
      <div>
        <h2>No album selected. Please select an album to view details.</h2>
      </div>
    );
  }

  const toggleSongSelection = (songId) => {
    setSelectedSongIds((prevSelected) =>
      prevSelected.includes(songId)
        ? prevSelected.filter((id) => id !== songId)
        : [...prevSelected, songId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSongIds.length === selectedAlbum.songs.length) {
      setSelectedSongIds([]);
    } else {
      setSelectedSongIds(selectedAlbum.songs.map((song) => song._id));
    }
  };

  const handleAddClick = () => {
    if (selectedSongIds.length === 0) {
      setErrorMessage("Please select at least one song to add.");
      return;
    }
    if (!selectedPlaylistId) {
      setErrorMessage("Please select a playlist.");
      return;
    }
    setErrorMessage("");

    const songsToAdd = selectedAlbum.songs.filter((song) =>
      selectedSongIds.includes(song._id)
    );
    const playlist = playlists.find((pl) => pl._id === selectedPlaylistId);

    if (playlist) {
      songsToAdd.forEach((song) => {
        onAddSongToPlaylist(song, playlist);
      });
      setSelectedSongIds([]);
      setSelectedPlaylistId(null);
    }
  };

  return (
    <div>
      <h1>Album Details</h1>
      <div>
        <h2>{selectedAlbum.name}</h2>
        {selectedAlbum.artist && (
          <p>
            <strong>Artist:</strong> {selectedAlbum.artist}
          </p>
        )}
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
            <button onClick={toggleSelectAll}>
              {selectedSongIds.length === selectedAlbum.songs.length
                ? "Deselect All"
                : "Select All"}
            </button>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {selectedAlbum.songs.map((song) => (
                <li
                  key={song._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSongIds.includes(song._id)}
                    onChange={() => toggleSongSelection(song._id)}
                    style={{ marginRight: "8px" }}
                  />
                  {song.coverImg && (
                    <img
                      src={song.coverImg}
                      alt={song.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <div>
                    <div>
                      <strong>{song.name}</strong>
                    </div>
                    {song.artist && (
                      <div>
                        <small style={{ color: "#555" }}>
                          Artist: {song.artist}
                        </small>
                      </div>
                    )}
                    {song.duration && (
                      <div>
                        <small style={{ color: "#888" }}>
                          Duration: {song.duration} min
                        </small>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "10px" }}>
              <label>Select Playlist:</label>
              <div>
                {playlists && playlists.length > 0 ? (
                  playlists.map((pl) => (
                    <label key={pl._id} style={{ display: "block", marginBottom: "6px" }}>
                      <input
                        type="radio"
                        name="playlist"
                        value={pl._id}
                        checked={selectedPlaylistId === pl._id}
                        onChange={(e) => setSelectedPlaylistId(e.target.value)}
                        style={{ marginRight: "8px" }}
                      />
                      {pl.name}
                    </label>
                  ))
                ) : (
                  <p>No playlists available</p>
                )}
              </div>
              <button onClick={handleAddClick} style={{ marginTop: "10px" }}>
                Add to Playlist
              </button>
              {errorMessage && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
