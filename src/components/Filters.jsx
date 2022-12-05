import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { TextField, Flex, View } from '@aws-amplify/ui-react';

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
  const [songLimit, setSongLimit] = useState(15);
  const [gatherSongs, handleGatherSongs] = useState(false);
  const [randomSongsLength, setRandomSongsLength] = useState(0);

  const handlePlaylistName = (e) => {
    setPlaylistName(e.target.value);
  }

  const handleSongLimit = (e) => {
    setSongLimit(e.target.value);
  }

  const years = [2019, 2020, 2021, 2022]

  const date_constants = new Map();
  for (let i = 0; i < years.length; i++) {
    date_constants.set(years[i], {
      "Winter": {
        "start": years[i] + "-12-21T00:00:00Z",
        "end": years[i + 1] + "-03-19T00:00:00Z"
      },
      "Spring": {
        "start": years[i] + "-03-20T00:00:00Z",
        "end": years[i] + "-06-20T00:00:00Z"
      },
      "Summer": {
        "start": years[i] + "-06-21T00:00:00Z",
        "end": years[i] + "-09-21T00:00:00Z"
      },
      "Fall": {
        "start": years[i] + "-09-22T00:00:00Z",
        "end": years[i] + "-12-20T00:00:00Z"
      },
    })
  }

  const dropDownOptionsComponent = years.map((year) => {
    return (
      <Dropdown.Item onClick={() => { setYear(year); handleSelectYear(true); }}>{year}</Dropdown.Item>
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
        for (let i = 0; i < response.data["items"].length; i++) {
          let playlistEndpoint = response.data.items[i].tracks.href;
          handleGetPlaylistDetails(playlistEndpoint);
        }
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
        let songs = response.data.items;
        function withinTimeframe(song) {
          const date_added = new Date(song.added_at);
          return Date.parse(date_added) > Date.parse(date_constants.get(year)[season].start) &&
            Date.parse(date_added) < Date.parse(date_constants.get(year)[season].end);
        }
        let songs_time_frame = songs.filter((song) => withinTimeframe(song));
        let random_songs_arr = [];
        let counter = 0;
        if (songs_time_frame.length !== 0) {
          songs_time_frame.forEach((song) => {
            let random_boolean = (Math.random() < 0.42);
            if (random_boolean === true) {
              random_songs_arr.push(song);
              counter++;
              setRandomSongsLength(counter)
            }
          })
        } else if (songs_time_frame.length === 0 && counter === 0) {

        } else if (songs_time_frame.length === 0 && counter !== 0) {

        } else {
          setRandomSongsLength(0);
        }

        let playlist_random_uri = []
        for (let i = 0; i < songLimit; i++) {
          playlist_random_uri.push((random_songs_arr[i].track.uri).toString());
        }
        playlistURI = playlist_random_uri;
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
    let data = JSON.stringify({
      uris: playlistURI,
      position: 0,
    });
    let config = {
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
        alert("You don't have any songs for the selected time frame. Select a different season and/or year, then gather songs and add to the playlist again.");
      });
  };

  const handleCreatePlaylist = () => {
    let uris = []
    let data = JSON.stringify({
      name: playListName,
      description:
        "To be filled in with randomized songs from a given time period.",
      public: false,
    });
    let config = {
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
    <div>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        gap="1rem"
      >
        <View>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="season-dropdown">
              Season
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => { setSeason("Winter"); handleSelectSeason(true); }}>
                Winter
              </Dropdown.Item>
              <Dropdown.Item onClick={() => { setSeason("Spring"); handleSelectSeason(true); }}>
                Spring
              </Dropdown.Item>
              <Dropdown.Item onClick={() => { setSeason("Summer"); handleSelectSeason(true); }}>
                Summer
              </Dropdown.Item>
              <Dropdown.Item onClick={() => { setSeason("Fall"); handleSelectSeason(true); }}>Fall</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </View>
        <View>
          <Dropdown>

            <Dropdown.Toggle variant="success" id="season-dropdown">
              Year
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {dropDownOptionsComponent}
            </Dropdown.Menu>
          </Dropdown>
        </View>
        {/* <label htmlFor="songLimit">Number of Songs in the Playlist: </label> */}
        <View>
          <TextField type="text" id="songLimit" name="songLimit" label="Number of Songs in the Playlist:" onChange={handleSongLimit} />
          <p>Maximum number of songs you can add is {randomSongsLength}</p>
        </View>

        

        <View>
          <button
            onClick={() => {
              handleGatherSongs(false);
              handleGetPlaylists();
              handleGetUserId();
              handleFilterPlaylists();
              playlistURI = [];
              handleGatherSongs(false);
              alert("We gathered your songs!")
            }}
            disabled={!(selectSeason && selectYear)}
          >
            Gather your songs...
          </button>
        </View>

        <View>
          <label htmlFor="playlistName">Playlist Name: </label>
          <input type="text" id="playlistName" name="playlistName" onChange={handlePlaylistName} />
          <button
            onClick={() => {
              handleCreatePlaylist();
              alert("Playlist created!")
              console.log("Playlist URI = ", playlistURI)
            }}
            disabled={gatherSongs}
          >
            Create Playlist
          </button>
        </View>

        <View>
          <button
            onClick={() => {
              handleAddSongsToPlaylist();
              playlistURI = [];
              //alert("Songs were added to the playlist!")        
            }}
            disabled={gatherSongs}
          >
            Add song's to the Playlist
          </button>
        </View>
      </Flex>
    </div>
  );
}

export default Filters;
