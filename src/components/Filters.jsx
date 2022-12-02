import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";
const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";
const GET_PLAYLIST_ITEMS_ENDPOINT =
  "https://api.spotify.com/v1/playlists/2qFDu3xwuUBPaVs7gsD9jh/tracks"; //(not used yet)
const ADD_SONGS_TO_PLAYLIST = "https://api.spotify.com/v1/playlists/";
const CREATE_CUSTOM_PLAYLIST = "https://api.spotify.com/v1/users/";

const SPRING = ["03-20", "06-20"];
const SUMMER = ["06-21", "09-21"];
const FALL = ["09-22", "12-20"];
const WINTER = ["12-21", "03-19"];

// The max number of songs that
var song_limit = 60;
let playlistURI = [];

function Filters() {
  const [token, setToken] = useState("");
  const [validSongs, setValidSongs] = useState("");
  const [userId, setUserId] = useState({});
  const [year, setYear] = useState({});
  const [season, setSeason] = useState({});
  const [createdPlaylistId, setCreatedPlaylistId] = useState("");
  const [playListName, setPlaylistName] = useState("");
  const [selectYear, handleSelectYear] = useState(false);
  const [selectSeason, handleSelectSeason] = useState(false);

  const handlePlaylistName = (e) => {
    setPlaylistName(e.target.value);
  }

  const years = [2019, 2020, 2021, 2022]

  const date_constants = new Map();
  for(let i = 0; i < years.length; i++) {
    date_constants.set(years[i], {
      "Winter": {
        "start": years[i]+ "-12-21T00:00:00Z",
        "end": years[i + 1]+ "-03-19T00:00:00Z"
      },
      "Spring": {
        "start": years[i]+ "-03-20T00:00:00Z",
        "end": years[i]+ "-06-20T00:00:00Z"
      },
      "Summer": {
        "start": years[i]+ "-06-21T00:00:00Z",
        "end": years[i]+ "-09-21T00:00:00Z"
      },
      "Fall": {
        "start": years[i]+ "-09-22T00:00:00Z",
        "end": years[i]+ "-12-20T00:00:00Z"
      },
    })
  }

  const dropDownOptionsComponent = years.map((year) => {
    return(
      <Dropdown.Item onClick={() => {setYear(year);handleSelectYear(true);}}>{year}</Dropdown.Item>
    )
  })

  // Grab the user's spotify access token from local storage (this is after you press the log in button)
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
  }, []);

  // Console logging state variables
  useEffect(() => {
    console.log(userId);
  }, []);

  // this is returning a list of 50 of the users recent playlists
  const handleGetPlaylists = () => {
    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        // initial response of json with 50 playlists
        for (var i = 0; i < response.data["items"].length; i++) {
          var playlistEndpoint = response.data.items[i].tracks.href;
          handleGetPlaylistDetails(playlistEndpoint);
        }
        // Restore the song limit counter variables (it is counted down in use)
        song_limit = 20;
      })
      .catch((error) => {
        console.log("server side error in handleGetPlaylists: " + error);
      });
  };

  // handleGetPlaylist is getting the songs from each playlist that is passed through
  const handleGetPlaylistDetails = (playlistId) => {
    axios
      .get(playlistId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        var songs = response.data.items;
        let songHtml = "<p>Song Names:</p>";
        // tracks how many songs have been added from this particular playlist
        // the number of songs being checked is 100 song uri's
        let num_songs_checked = 0;
        // process playlist then return URIs of all songs inside playlist
        for (var i = 0; i < response.data.items.length; i++) {
          //  "2022-12-02T05:56:28Z"
          const date_added = new Date(songs[i].added_at);
          if (Date.parse(date_added) > Date.parse(date_constants.get(year)[season].start) && Date.parse(date_added) < Date.parse(date_constants.get(year)[season].end)) {
            num_songs_checked++;
            var random_boolean = Math.random() < 0.5; 
            if (random_boolean == true && song_limit > 0 && num_songs_checked <= 100) { // randomly choose 20 songs from given season and year to add to playlist
              song_limit--;
              playlistURI.push((songs[i].track.uri).toString());
              let songsTrackName = songs[i]["track"]["name"];
              let songTrackUrl = songs[i]["track"]["external_urls"]["spotify"];
              songHtml += `<p>${songsTrackName} - ${songTrackUrl}</p>`;
              for (var j = 0; j < songs[i].track.artists.length; j++) {
                let artistName = songs[i].track.artists[j].name;
                songHtml += artistName + "<br>";
              }
            }
          }
          
        }

        // 	https://api.spotify.com/v1/playlists/{playlist_id}/tracks
        // POST Docs:
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
        // stuff to add songs to a newly created playlist
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddSongsToPlaylist = () => {
    var data = JSON.stringify({
      uris: playlistURI,
      position: 0,
    });
    var config = {
      method: "post",
      url: ADD_SONGS_TO_PLAYLIST + createdPlaylistId + "/tracks",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: data,
    };
    axios(config)
      .then((response) => {
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreatePlaylist = () => {
    let uris = []
    var data = JSON.stringify({
      name: playListName,
      description:
        "To be filled in with randomized songs from a given time period.",
      public: false,
    });
    var config = {
      method: "post",
      url: CREATE_CUSTOM_PLAYLIST + userId + "/playlists",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        setCreatedPlaylistId(response.data.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  const handleGetUserId = () => {
    axios
      .get(USER_ID_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((id) => {
        setUserId(id.data["id"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Doesn't do anything yet
  const handleFilterPlaylists = () => {
    axios
      .get(GET_PLAYLIST_ITEMS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((songs) => {
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <section>
      
      <Dropdown>
        <Dropdown.Toggle variant="success" id="season-dropdown">
          Season
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => {setSeason("Winter");handleSelectSeason(true);}}>
            Winter
          </Dropdown.Item>
          <Dropdown.Item onClick={() => {setSeason("Spring");handleSelectSeason(true);}}>
            Spring
          </Dropdown.Item>
          <Dropdown.Item onClick={() => {setSeason("Summer");handleSelectSeason(true);}}>
            Summer
          </Dropdown.Item>
          <Dropdown.Item onClick={() => {setSeason("Fall");handleSelectSeason(true);}}>Fall</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="season-dropdown">
          Year
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {dropDownOptionsComponent}
        </Dropdown.Menu>
      </Dropdown>
      <br />
      <button
        onClick={() => {
          handleGetPlaylists();
          handleGetUserId();
          handleFilterPlaylists();
          alert("We gathered your songs!")
        }}
      >
        Gather your songs...
      </button>
      <br />
      <label htmlFor="playlistName">Playlist Name: </label>
      <input type="text" id="playlistName" name="playlistName" onChange={handlePlaylistName} />
      <button
        onClick={() => {
          handleCreatePlaylist();
          alert("Playlist created!")    
        }}
      >
        Create Playlist
      </button>
      <br />
      <button
        onClick={() => {
          handleAddSongsToPlaylist();
          playlistURI = [];
          alert("Songs were added to the playlist!")        
        }}
        disabled={!(selectSeason && selectYear)}
      >
        Add song's to the Playlist
      </button>
    </section>
  );
}

export default Filters;
