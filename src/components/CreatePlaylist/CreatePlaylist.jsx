import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { createPlaylist } from "../../services/playlistService";

const CreatePlaylist = () => {
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [totalDuration, setTotalDuration] = useState(0);
  const [songs, setSongs] = useState([{ name: "" }]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Update song name at a given index
  const handleSongChange = (index, value) => {
    const updatedSongs = [...songs];
    updatedSongs[index].name = value;
    setSongs(updatedSongs);
  };

  // Add a blank song input
  const addSongField = () => setSongs([...songs, { name: "" }]);

  // Remove song input by index
  const removeSongField = (index) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  // Handle playlist form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Prepare songs array of non-empty trimmed names
    const songNames = songs
      .filter((s) => s.name.trim() !== "")
      .map((s) => s.name.trim());

    const playlistData = {
      listener: user._id,
      name,
      totalDuration: Number(totalDuration),
      songs: songNames,
    };

    try {
      await createPlaylist(playlistData);
      setSuccess("Playlist created successfully!");
      setName("");
      setTotalDuration(0);
      setSongs([{ name: "" }]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create New Playlist</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Playlist Name:</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Total Duration (seconds):</label>
          <input
            type="number"
            value={totalDuration}
            required
            min={0}
            onChange={(e) => setTotalDuration(e.target.value)}
          />
        </div>

        <div>
          <label>Songs:</label>
          {songs.map((song, idx) => (
            <div key={idx}>
              <input
                type="text"
                placeholder={`Song ${idx + 1} name`}
                value={song.name}
                onChange={(e) => handleSongChange(idx, e.target.value)}
                required
              />
              {songs.length > 1 && (
                <button type="button" onClick={() => removeSongField(idx)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSongField}>
            Add Song
          </button>
        </div>

        <button type="submit">Create Playlist</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default CreatePlaylist;
