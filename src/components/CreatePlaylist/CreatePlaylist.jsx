import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { createPlaylist } from "../../services/playlistService";

const CreatePlaylist = ({ onPlaylistCreated }) => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const playlistData = {
      listener: user._id,
      name,
      totalDuration: 0,
      songs: [],
    };

    try {
      const created = await createPlaylist(playlistData);
      setSuccess("Playlist created successfully!");
      setName("");
      if (onPlaylistCreated) onPlaylistCreated(created);
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
        <button type="submit">Create Playlist</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default CreatePlaylist;