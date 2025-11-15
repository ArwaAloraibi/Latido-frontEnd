import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const AlbumList = (props) => {
  
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/albums`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (data.err) throw new Error(data.err);
        setAlbums(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlbums();
  }, []);


  const handleAlbumClick = (album) => {
    props.handleSelectAlbum(album);
    navigate(`/albums/${album._id}`);
  };

  console.log(props);

  return (
    <div>
      <h1>Album List</h1>
      <div>
         {!props.albums.length ? (
          <h2>No Albums Yet!</h2>
        ) : (
        <ul>
          {props.albums.map((album) => (
            <li 
            key={album._id}  
            style={{ cursor: 'pointer', color: "#646CFF" }}
            onClick={() => handleAlbumClick(album)}
            >
            {album.name}</li>

          ))}
        </ul>
        )}
      </div>
    </div>
  );
}
export default AlbumList;