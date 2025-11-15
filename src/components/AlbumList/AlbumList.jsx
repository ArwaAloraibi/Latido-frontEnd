import { useNavigate } from 'react-router';

const AlbumList = (props) => {
  const navigate = useNavigate();

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