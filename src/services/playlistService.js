const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/playlists`;
const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

export const index = async () => {
  const res = await fetch(`${BASE_URL}/`, { method: 'GET', headers });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

export const createPlaylist = async (playlistData) => {
  const res = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(playlistData),
  });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

// New: Add multiple songs to existing playlist
export const addSongsToPlaylist = async (playlistId, songIds) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ songs: songIds }),
  });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};
