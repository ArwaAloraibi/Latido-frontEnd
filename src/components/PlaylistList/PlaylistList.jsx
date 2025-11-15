import React from "react";

const PlaylistList = ({ playlists }) => {
  return (
    <div>
      <h1>Playlist List</h1>
      {!playlists.length ? (
        <h2>No playlists yet!</h2>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {playlists.map((playlist) => (
            <li key={playlist._id} style={{ marginBottom: "8px" }}>
              <a
                href={`/playlists/${playlist._id}`}
                style={{
                  color: "#007bff",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {playlist.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistList;
