import { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ src }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const togglePlayPause = () => setPlaying(!playing);

  return (
    <div>
      <audio src={src} ref={audioRef} />
      <button onClick={togglePlayPause}>{playing ? 'Pause' : 'Play'}</button>
    </div>
  );
};

export default AudioPlayer;
