import React from 'react';
import './App.css';
import TrackList from '../Tracklist/Tracklist.js';
import Track from '../Track/Track.js';
import SearchBar from '../Searchbar/Searchbar.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracklist: [],
      playlist: [],
      playlistName: {value: 'New playlist'},
    };
    this.searchResults = this.searchResults.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.changePlaylistName = this.changePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }
  searchResults() {
    Spotify.trackRequest().then(tracksArray => {
      this.setState({
        tracklist: tracksArray
      })
    });
  }
  addTrack(newPlayListItemId) {
    const newPlayListItem = this.state.tracklist.filter(track => {
        return track.id == newPlayListItemId;
    });
    const isIncluded = this.state.playlist.findIndex(track => {
        return track.id == newPlayListItemId;
    })
    if (isIncluded == -1) {
      this.setState(prevState => ({
        playlist: [...prevState.playlist, newPlayListItem[0]]
      }))
    }
  }
  removeTrack(playListItemId) {
    const newPlaylist = this.state.playlist.filter(track => {
        return track.id != playListItemId;
    });
    this.setState({
      playlist: newPlaylist
    })
  }
  changePlaylistName(e) {
    this.setState({playlistName: {value: e.target.value}});
  }
  savePlaylist() {
    const trackURIs = this.state.playlist.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName.value, trackURIs
      ).then(() => {
        this.setState({
        playlistName: {value: "New Playlist"},
        playlist: []
      });
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onClick={this.searchResults}
          />
          <div className="App-playlist">
            <TrackList
              tracklist={this.state.tracklist}
              onClick={this.addTrack}
            />
            <Playlist
              playlist={this.state.playlist}
              onClick={this.removeTrack}
              onChange={this.changePlaylistName}
              playlistName={this.state.playlistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
