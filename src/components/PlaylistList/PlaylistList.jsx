const PlaylistList = (props) => {

    console.log(props);

  return (
    <div>
      <h1>playlist List</h1>
      <div>
         {!props.playlists.length ? (
          <h2>No playlists Yet!</h2>
        ) : (
        <ul>
          {props.playlists.map((playlist) => (
            <li key={playlist._id}>{playlist.name}</li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}
export default PlaylistList;