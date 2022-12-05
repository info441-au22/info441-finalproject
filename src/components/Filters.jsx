import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";
const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";
const GET_PLAYLIST_ITEMS_ENDPOINT =
  "https://api.spotify.com/v1/playlists/2qFDu3xwuUBPaVs7gsD9jh/tracks"; //(not used yet)
const ADD_SONGS_TO_PLAYLIST = "https://api.spotify.com/v1/playlists/";
const CREATE_CUSTOM_PLAYLIST = "https://api.spotify.com/v1/users/";
const GET_SAVED_TRACKS = "https://api.spotify.com/v1/me/tracks?offset=100&limit=50";

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
  const [addItemstoList, setItemstoList] = useState(false);
  

  const handlePlaylistName = (e) => {
    setPlaylistName(e.target.value);
  }

  const handleSongLimit = (e) => {
    setSongLimit(e.target.value);
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
      <Dropdown.Item onClick={() => {setYear(year);handleSelectYear(true);setItemstoList(false);handleGetUserId();
          handleGetPlaylists();
          handleFilterPlaylists();
          }}>{year}</Dropdown.Item>
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

  const handleGetTracks = () => {
    axios.get(GET_SAVED_TRACKS, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      console.log(response.data['items']);
      
        let songs = response.data.items;
        console.log(songs)
        function withinTimeframe(song) {
          const date_added = new Date(song.added_at);
          //console.log(date_added)
          return (Date.parse(date_added) > Date.parse(date_constants.get(year)[season].start)) &&
          (Date.parse(date_added) < Date.parse(date_constants.get(year)[season].end));
        }

        let songs_time_frame = songs.filter((song) => withinTimeframe(song));
        let random_songs_arr = [];
        let counter = 0;
        console.log(songs_time_frame);
        if(songs_time_frame.length !== 0) {
          songs_time_frame.forEach((song) => {
            let random_boolean = (Math.random() < 0.42);
            if(random_boolean === true) {
             //console.log("song:",song)
              random_songs_arr.push(song);
              counter++;
              //setRandomSongsLength(counter)
              //setRandomSongsLength(songs_time_frame.length)
            }
          })
        } 
        let playlist_random_uri = [];

      for (let i = 0; i < songLimit; i++) {
        //setRandomSongsLength(songLimit)
        console.log("random songs arr: "+ random_songs_arr)
        playlist_random_uri.push((random_songs_arr[i].track.uri).toString());            
      }
      playlistURI = playlist_random_uri;
      
    

    })
    .catch((error) => {
      console.log(error);
    })
  }

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
        console.log(songs);
        function withinTimeframe(song) {
          const date_added = new Date(song.added_at);
          console.log(Date.parse(date_added)  ," added date")
          console.log(Date.parse(date_constants.get(year)[season].start) ," selected start")
          console.log(Date.parse(date_constants.get(year)[season].end) ," selected end")
          return (Date.parse(date_added) > Date.parse(date_constants.get(year)[season].start)) &&
          (Date.parse(date_added) < Date.parse(date_constants.get(year)[season].end));
        }
        let songs_time_frame = songs.filter((song) => withinTimeframe(song));
        let random_songs_arr = [];
        let counter = 0;
        console.log(songs_time_frame.length);
        if(songs_time_frame.length !== 0) {
          songs_time_frame.forEach((song) => {
            let random_boolean = (Math.random() < 0.42);
            if(random_boolean === true) {
             //console.log("song:",song)
              random_songs_arr.push(song);
              counter++;
              //setRandomSongsLength(counter)
              //setRandomSongsLength(songs_time_frame.length)
            }
          })
        } 
          
        else if(songs_time_frame.length === 0 && counter !== 0) {

        } else {
          setRandomSongsLength(0);
        }

        let playlist_random_uri = [];
        console.log("random songs arr: "+ random_songs_arr)
        setRandomSongsLength(random_songs_arr.length)  
       
        for (let i = 0; i < songLimit; i++) {
          //setRandomSongsLength(songLimit)
          console.log("random songs arr: "+ random_songs_arr)
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

  const seasonRender =  () => {
    if (handleSelectSeason) {
      return <h1>wrong</h1>;
    } else {
      return <h1>right</h1>;
    }
  }

  return (
    <section>

      {/* <button onClick={handleGetTracks}>
        Get Saved Tracks
      </button> */}
      {seasonRender}
      <Dropdown>
        <Dropdown.Toggle variant="success" id="season-dropdown">
          Season
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => {setSeason("Winter");handleSelectSeason(true);setItemstoList(false);handleGetPlaylists();
          handleGetUserId();
          handleFilterPlaylists();
          }}>
            Winter
          </Dropdown.Item>
          <Dropdown.Item onClick={() => {setSeason("Spring");handleSelectSeason(true);setItemstoList(false);handleGetPlaylists();
          handleGetUserId();
          handleFilterPlaylists();
          }}>
            Spring
          </Dropdown.Item>
          <Dropdown.Item onClick={() => {setSeason("Summer");handleSelectSeason(true);setItemstoList(false);handleGetPlaylists();
          handleGetUserId();
          handleFilterPlaylists();
          }}>
            Summer
          </Dropdown.Item>
          <Dropdown.Item onClick={() => {setSeason("Fall");handleSelectSeason(true);setItemstoList(false);handleGetPlaylists();
          handleGetUserId();
          handleFilterPlaylists();
          }}>Fall</Dropdown.Item>
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
      <label htmlFor="songLimit">Number of Songs in the Playlist: </label>
      <input type="text" id="songLimit" name="songLimit" onChange={handleSongLimit} />
      <br />
      <p>Maximum number of songs you can add is {randomSongsLength}</p>
      <br />
      <button
        onClick={() => {
          handleGatherSongs(false);
          // handleGetPlaylists();
          // handleGetUserId();
          // handleFilterPlaylists();
          // playlistURI = [];
          handleGatherSongs(false);
          alert("We gathered your songs!")
          setItemstoList(false)  
        }}
        disabled={!(selectSeason && selectYear)}
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
          console.log("Playlist URI = ", playlistURI) 
          
        }}
        disabled={gatherSongs}
      >
        Create Playlist
      </button>
      <br />
      <button
        onClick={() => {
          handleAddSongsToPlaylist();
          playlistURI = [];
          setItemstoList(true)
          //alert("Songs were added to the playlist!")        
        }}
        disabled={gatherSongs || addItemstoList}
      >
        Add song's to the Playlist
      </button>
    </section>
  );
}

export default Filters;


// setRandomSongs should be the length of random_songs_arr ?
// whatever you choose after clicking "gather your songs", it will not but the specified amount of songs
// disable "add songs to playlist" button until they either change year, season or gather songs again
// "number of songs playlist" input? needs to be disabled until gather or remove max num of song cause misleading
// i think you need to set "number of songs in playlist" field when clicking on "playlist name" other wise you will get empty uris
// so we should disable number of songs in playlist button until user clicks on gather songs
// after user 

