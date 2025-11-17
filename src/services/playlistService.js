// playlistService - handles all API calls related to playlists
// This service communicates with the backend to manage playlists

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/playlists`;

// Helper function to get headers with auth token
// We include the token so the backend knows who is making the request
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

// Fetch all playlists from the backend
export const index = async () => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

// Get a specific playlist by its ID
export const show = async (playlistId) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

// Create a new playlist without files (just JSON data)
// This is for simple playlist creation without cover images
export const createPlaylist = async (playlistData) => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: getHeaders(),
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

// Create a new playlist with cover image (FormData)
// This is used when uploading a playlist cover image
// We don't set Content-Type header - browser sets it automatically for FormData
export const createWithFile = async (formData) => {
  try {
    // Only include auth header, not Content-Type
    // Browser will set Content-Type automatically with the boundary for FormData
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const res = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: headers,
      body: formData
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

// Update a playlist without files (just JSON data)
// This is for updating playlist name or song list
export const update = async (playlistId, updateData) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

// Update a playlist with cover image (FormData)
// This is used when updating the playlist cover image
export const updateWithFile = async (playlistId, formData) => {
  try {
    // Only include auth header, not Content-Type
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: "PUT",
      headers: headers,
      body: formData
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
  try {
    const res = await fetch(`${BASE_URL}/${playlistId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
