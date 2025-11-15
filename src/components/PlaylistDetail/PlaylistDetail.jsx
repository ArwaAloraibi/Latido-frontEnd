const PlaylistDetail = ({ selectedPlaylist }) => {
  if (!selectedPlaylist) {
    return (
      <div>
        <h2>No playlist selected. Please select a playlist to view details.</h2>
      </div>
    );
  }

  const { name, listener, totalDuration, songs } = selectedPlaylist;

  // Convert totalDuration from seconds to mm:ss format
  const formatDuration = (duration) => {
    if (typeof duration !== "number" || isNaN(duration)) return "0:00";
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h1>Playlist Details</h1>
      <div>
        <h2>{name || "Unnamed Playlist"}</h2>
        {listener && (
          <p>
            Created by:{" "}
            {typeof listener === "object"
              ? listener.username || "Unknown"
              : listener}
          </p>
        )}
        <p>Total Duration: {formatDuration(totalDuration)}</p>

        {songs && songs.length > 0 ? (
          <div>
            <h3>Songs:</h3>
            <ul>
              {songs.map((song, idx) => (
                <li
                  key={song._id || idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <div>{song.name || "Unknown Song"}</div>
                    {song.duration && (
                      <small style={{ color: "#888" }}>
                        {formatDuration(song.duration)}
                      </small>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No songs in this playlist.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
