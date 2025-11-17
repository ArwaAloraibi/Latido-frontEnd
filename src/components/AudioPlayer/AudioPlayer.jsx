// AudioPlayer component - plays songs with controls
// This is a fixed player that stays at the bottom of the screen

import { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ song, isPlaying, onPlay, onPause, onEnd }) => {
  // useRef gives us a reference to the actual audio element
  // We need this to control playback directly
  const audioRef = useRef(null);
  
  // Track current playback time and total duration
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Set up event listeners for the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Function to update current time as song plays
    const updateTime = () => setCurrentTime(audio.currentTime);
    
    // Function to get total duration when audio loads
    const updateDuration = () => setDuration(audio.duration);
    
    // Function to handle when song ends
    const handleEnd = () => {
      if (onEnd) onEnd();
    };

    // Add event listeners to the audio element
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    // Clean up event listeners when component unmounts
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [onEnd]);

  // Handle play/pause based on isPlaying prop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Try to play, catch any errors (like autoplay restrictions)
      audio.play().catch(err => console.error('Error playing audio:', err));
      if (onPlay) onPlay();
    } else {
      // Pause the audio
      audio.pause();
      if (onPause) onPause();
    }
  }, [isPlaying, onPlay, onPause]);

  // Helper function to format seconds into mm:ss format
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle when user drags the seek slider
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    // Calculate new time based on slider position (0-100%)
    const newTime = (e.target.value / 100) * duration;
    // Set the audio to that time
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Don't render anything if no song is selected
  if (!song) return null;

  // Get the audio URL - it might be in different fields depending on the data
  const audioUrl = song.audioUrl || song.file || song.url || '';

  // Show error message if no audio file is available
  if (!audioUrl) {
    return (
      <div className="audio-player-error">
        No audio file available for this song
      </div>
    );
  }

  return (
    <div className="audio-player">
      {/* Hidden audio element - we control it with refs */}
      <audio ref={audioRef} src={audioUrl} />
      
      {/* Song info section */}
      <div className="audio-player-info">
        <div className="audio-player-title">{song.name || 'Unknown Song'}</div>
        <div className="audio-player-artist">
          {/* Show artist name - check multiple possible locations */}
          {(() => {
            // Try to get artist from different possible locations
            if (song.artist) {
              // If artist is an object with username, use it
              if (typeof song.artist === 'object' && song.artist.username) {
                return song.artist.username;
              }
              // If artist is a string, it might be a username or userId
              // If it looks like an ObjectId (24 hex characters), it's probably a userId
              if (typeof song.artist === 'string') {
                // Check if it's an ObjectId (MongoDB IDs are 24 hex characters)
                if (song.artist.length === 24 && /^[0-9a-fA-F]{24}$/.test(song.artist)) {
                  // It's a userId, not a username - we can't display it
                  // Try to get from album instead
                } else {
                  // It's probably a username string
                  return song.artist;
                }
              }
            }
            // Try to get artist from album if song has album info
            if (song.album && typeof song.album === 'object') {
              if (song.album.userId) {
                if (typeof song.album.userId === 'object' && song.album.userId.username) {
                  return song.album.userId.username;
                }
                // If userId is a string (ObjectId), we can't get username from it
                if (typeof song.album.userId === 'string' && song.album.userId.length === 24) {
                  // It's an ObjectId, can't display it
                }
              }
            }
            return 'Unknown Artist';
          })()}
        </div>
      </div>

      {/* Playback controls section */}
      <div className="audio-player-controls">
        {/* Seek slider - allows user to jump to any point in the song */}
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          className="audio-player-slider"
        />
        {/* Time display - shows current time and total duration */}
        <div className="audio-player-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play/Pause button */}
      <button
        onClick={() => {
          if (isPlaying) {
            if (onPause) onPause();
          } else {
            if (onPlay) onPlay();
          }
        }}
        className="btn-primary audio-player-play-btn"
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
};

export default AudioPlayer;
