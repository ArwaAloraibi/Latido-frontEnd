// Base URL updated to /playlists endpoint
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/playlists`;
// Authorization header with bearer token from localStorage
const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

// Fetch all playlists (existing index function)
export const index = async () => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

// Create a new playlist with array of songs in one request
export const createPlaylist = async (playlistData) => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playlistData),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
