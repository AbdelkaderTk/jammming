// Spotify API urls
const authorizationUrl = 'https://accounts.spotify.com/authorize?'
const clientId = "b9933fd974314dfda2dba0f734a34afa";
const responseType = "token";
const redirectUri = "http://localhost:3000/";
const scope = "user-read-private playlist-modify playlist-modify-private";
const searchUrl = 'https://api.spotify.com/v1/search?';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const URLToken = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpiration = window.location.href.match(/expires_in=([^&]*)/);
    if (URLToken && tokenExpiration) {
      accessToken = URLToken[1];
      const expires = Number(tokenExpiration[1]);
      window.setTimeout(()=> accessToken = '', 60000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const authEndpoint = `${authorizationUrl}client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authEndpoint;
    }
  },
  async trackRequest() {
    this.getAccessToken();
    const inputValue = document.querySelector('#searchInput').value;
    const inputValueQuery = inputValue.replace(/ /g, '+');
    const searchEndpoint = `${searchUrl}q=${inputValueQuery}&type=track`;
    try {
      const response = await fetch(searchEndpoint , {
        headers: {
         Authorization: 'Bearer ' + accessToken
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        const tracksArray = jsonResponse.tracks.items.map(item =>
          ({
          name: item.name,
          album: item.album.name,
          artists: item.artists[0].name,
          id: item.id,
          uri: item.uri
        }));
        return tracksArray;
      }
     } catch (error) {
      console.log(error);
    }
  },
  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) {return;}
    this.getAccessToken();
    let userId;
    let userIdEndpoint = 'https://api.spotify.com/v1/me';
    let playlistEndpoint;
    let playlistTracksEndpoint;
    return fetch(userIdEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }}).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message)
    }).then(jsonResponse => {
      userId = jsonResponse.id;
      playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
      return fetch(playlistEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: playlistName})
    }).then(response1 => {
      if (response1.ok) {
        return response1.json();
      }
      throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message)
    }).then(jsonResponse => {
      const playlistId = jsonResponse.id;
      playlistTracksEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
      return fetch(playlistTracksEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: JSON.stringify({uris: trackUris})
      });
    })
  })
  }
}

export default Spotify;
