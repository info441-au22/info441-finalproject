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
let playlistURI = "";

function Filters() {
  const [token, setToken] = useState("");
  const [validSongs, setValidSongs] = useState("");
  const [userId, setUserId] = useState({});
  const [year, setYear] = useState({});
  const [season, setSeason] = useState({});
  const [uriCounter, setUriCounter] = useState(0);
  const [createdPlaylistId, setCreatedPlaylistId] = useState("");

  // Grab the user's spotify access token from local storage (this is after you press the log in button)
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
  }, []);

  // Console logging state variables
  useEffect(() => {
    //console.log(playlists)
    //console.log(token)
    console.log(userId);
    //console.log(year)
    //console.log(season)
    //console.log(validSongs);
    //console.log(uriCounter)
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
          console.log(playlistEndpoint);
          // iterates through list of 50 playlists that is returned, then passes href/playlist endpoint to handleGetPlaylistDetails for further processing
          // (sent as https://api.spotify.com/v1/playlists/xxxxxxxxxxxxxxxxxxxx/tracks)
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
        // console.log(response.data)
        var songs = response.data.items;
        let songHtml = "<p>Song Names:</p>";
        // tracks how many songs have been added from this particular playlist (needed because
        // the song add limit for a post req is 50 song uri's)
        let num_songs_added = 0;
        // console.log(response.data)
        // process playlist then return URIs of all songs inside playlist
        for (var i = 0; i < response.data.items.length; i++) {
          if (songs[i].added_at.substring(0, 10) > "2021" + SPRING[0]) {
            num_songs_added++;
            song_limit--;

            if (song_limit > 0 && num_songs_added <= 50) {
              playlistURI += songs[i]["track"]["uri"] + ", ";

              console.log(songs[i]);
              console.log(songs[i].track.uri); // uri is for adding to a new playlist
              let songsTrackName = songs[i]["track"]["name"];
              let songTrackUrl = songs[i]["track"]["external_urls"]["spotify"];
              console.log(songsTrackName);
              console.log(songTrackUrl);
              songHtml += `<p>${songsTrackName} - ${songTrackUrl}</p>`;
              for (var j = 0; j < songs[i].track.artists.length; j++) {
                let artistName = songs[i].track.artists[j].name;
                songHtml += artistName + "<br>";
                console.log(artistName);
              }
            }
          }
          console.log(songHtml);
        }

        // 	https://api.spotify.com/v1/playlists/{playlist_id}/tracks
        // POST Docs:
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
        // stuff to add songs to a newly created playlist
        let temp = validSongs + playlistURI;
        setValidSongs(temp);
        console.log(validSongs.length);
        // setValidSongs(valid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddSongsToPlaylist = () => {
    axios
      .post(ADD_SONGS_TO_PLAYLIST + createdPlaylistId + "/tracks", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((id) => {
        setUserId(id.data["display_name"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreatePlaylist = () => {
    var data = JSON.stringify({
      name: "Spotify Capsule Playlist",
      description: "To be filled in with randomized songs from a given time period.",
      public: false,
    });
    var config = {
      method: "post",
      url: CREATE_CUSTOM_PLAYLIST + userId + "/playlists",
      headers: {
        Authorization:
          "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setCreatedPlaylistId(response.data["id"]);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  //   axios
  //     .post(CREATE_CUSTOM_PLAYLIST + userId + "/playlists", {
  //       headers: {
  //         Authorization:
  //           "Bearer " +
  //           "BQDnRpGtc0ZScs5_-j0QSS6gCp3VCxhLYCN1QZdwaEQrhKZGa4x7sV3yuRvpQ6RWKi6n5jF6eEiXGfzQDRG1g6oWAa82dWbamX_cNu7Cq67RK3Kpw-Eg4RbmOJpsPwjoR3w15DGgF-165GMlumCGNtLxYlvmt8p6BtE4OXBHp_8IY1rV4DV0M1odt6RhC2E_3H79_CrHNDMshnuNpBm_KxLRFSTctdDcuqKVEGq_dHueBXSgvDJ3v2UbYSYG6gqSH312RD9uLC0mHw",
  //         "Content-Type": "application/json",
  //       },
  //       data: data,
  //     })
  //     .then((response) => {
  //       setCreatedPlaylistId(response.data["id"]);
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
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
        //console.log(songs.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <button
        onClick={() => {
          handleGetPlaylists();
          handleGetUserId();
          handleFilterPlaylists();
        }}
      >
        Results
      </button>

      <button
        onClick={() => {
          handleCreatePlaylist();
        }}
      >Create Playlist</button>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="season-dropdown">
          Season
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSeason("Winter")}>
            Winter
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSeason("Spring")}>
            Spring
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSeason("Summer")}>
            Summer
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSeason("Fall")}>Fall</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="season-dropdown">
          Year
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setYear(2008)}>2008</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2009)}>2009</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2010)}>2010</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2011)}>2011</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2012)}>2012</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2013)}>2013</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2014)}>2014</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2015)}>2015</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2016)}>2016</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2017)}>2017</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2018)}>2018</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2019)}>2019</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2020)}>2020</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2021)}>2021</Dropdown.Item>
          <Dropdown.Item onClick={() => setYear(2022)}>2022</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default Filters;
