// albumService - handles all API calls related to albums
// This service communicates with the backend to get, create, update, and delete albums

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/albums`;

// Helper function to get headers with auth token
// We need to include the token in every request so the backend knows who we are
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

// Fetch all albums from the backend
export const index = async () => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Get a specific album by its ID
export const show = async (albumId) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Create a new album without files (just JSON data)
// This is for simple album creation without cover images or songs
export const create = async (albumData) => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(albumData)
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Create a new album with files (FormData)
// This is used when uploading album cover images and MP3 files
// We don't set Content-Type header here - browser sets it automatically for FormData
export const createWithFiles = async (formData) => {
  try {
    // Only include auth header, not Content-Type
    // Browser will set Content-Type automatically with the boundary for FormData
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Update an existing album (JSON - for simple updates without files)
// This is for updating album name or song list without file uploads
export const update = async (albumId, updateData) => {
  try {
    const res = await fetch(`${BASE_URL}/${albumId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Update an existing album with files (FormData)
// This is used when updating album cover image or adding new songs with MP3 files
// We don't set Content-Type header here - browser sets it automatically for FormData
export const updateWithFiles = async (albumId, formData) => {
  try {
    // Only include auth header, not Content-Type
    // Browser will set Content-Type automatically with the boundary for FormData
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const res = await fetch(`${BASE_URL}/${albumId}`, {
      method: 'PUT',
      headers: headers,
      body: formData
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// Delete an album
export const deleteAlbum = async (albumId) => {
  try {
    console.log('Deleting album:', albumId); // Debug log
    const res = await fetch(`${BASE_URL}/${albumId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    // Check if response is ok
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ err: `HTTP error! status: ${res.status}` }));
      throw new Error(errorData.err || `Failed to delete album: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Delete response:', data); // Debug log

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.error('Delete album error:', err);
    throw new Error(err.message || 'Failed to delete album');
  }
};
