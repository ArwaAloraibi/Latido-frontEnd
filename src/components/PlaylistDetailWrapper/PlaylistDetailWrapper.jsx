import { useParams } from 'react-router';
import PlaylistDetail from './PlaylistDetail';

const PlaylistDetailWrapper = ({ playlists, allSongs }) => {
  const { playlistId } = useParams();
  console.log("PlaylistDetailWrapper: playlistId =", playlistId);

  const playlist = playlists.find(p => p._id === playlistId);
  console.log("PlaylistDetailWrapper: found playlist =", playlist);

  if (!playlist) return <div>Playlist not found</div>;

  const populatedPlaylist = {
    ...playlist,
    songs: playlist.songs
      .map(id => allSongs.find(song => song._id === id))
      .filter(Boolean),
  };

  console.log("PlaylistDetailWrapper: populatedPlaylist.songs =", populatedPlaylist.songs);

  return <PlaylistDetail selectedPlaylist={populatedPlaylist} />;
};

export default PlaylistDetailWrapper;
