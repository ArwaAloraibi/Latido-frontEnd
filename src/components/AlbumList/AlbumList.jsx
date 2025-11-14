const AlbumList = (props) => {

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
            <li key={album._id}>{album.name}</li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}
export default AlbumList;