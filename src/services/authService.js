// src/services/authService.js


const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const text = await res.text();
    
    if (!text) {
      throw new Error('Empty response from server. Check if backend is running and endpoint is correct.');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }

    if (!res.ok) {
      throw new Error(data.err || `HTTP error! status: ${res.status}`);
    }

    if (data.err) {
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log(data.token)
      return JSON.parse(atob(data.token.split('.')[1]))
    }

    throw new Error('Invalid response from server');
  } catch (err) {
    console.log(err);
    throw err instanceof Error ? err : new Error(String(err));
  }
};

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const text = await res.text();
    
    if (!text) {
      throw new Error('Empty response from server. Check if backend is running and endpoint is correct.');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }

    if (!res.ok) {
      throw new Error(data.err || `HTTP error! status: ${res.status}`);
    }

    if (data.err) {
      throw new Error(data.err);
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      return JSON.parse(atob(data.token.split('.')[1]))
    }

    throw new Error('Invalid response from server');
  } catch (err) {
    console.log(err);
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export {
  signUp, signIn
};

