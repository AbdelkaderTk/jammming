import React from 'react';
import Track from '../Track/Track.js';
import './Playlist.css';

class Playlist extends React.Component {
  render() {
    return (
      <div className="Playlist">
        <input type='text' value={this.props.playlistName.value} onChange={this.props.onChange}/>
        <div className="TrackList">
          {this.props.playlist.map(track => {
            return (
              <Track
                key={track.id}
                id={track.id}
                name={track.name}
                artists={track.artists}
                album={track.album}
                uri={track.uri}
                onClick={this.props.onClick}
                linkContent='-'
              />
            );
          })}
        </div>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
