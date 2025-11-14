const SongList = (props) => {

    console.log(props);

  return (
    <div>
      <h1>Song List</h1>
      <div>
         {!props.songs.length ? (
          <h2>No songs Yet!</h2>
        ) : (
        <ul>
          {props.songs.map((song) => (
            <li key={song._id}>{song.name}</li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}
export default SongList;