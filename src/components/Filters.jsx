import React, { useEffect, useState } from "react";
import axios from "axios";
import {Dropdown} from "react-bootstrap";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";
const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";
const GET_PLAYLIST_ITEMS_ENDPOINT = "https://api.spotify.com/v1/playlists/2qFDu3xwuUBPaVs7gsD9jh/tracks";

const SPRING = ["03-20", "06-20"];
const SUMMER = ["06-21", "09-21"];
const FALL = ["09-22", "12-20"];
const WINTER = ["12-21", "03-19"];

function Filters() {
  const [token, setToken] = useState("");
  const [validSongs, setValidSongs] = useState("");
  const [userId, setUserId] = useState({});
  const [year, setYear] = useState({});
  const [season, setSeason] = useState({});
  const [uriCounter, setUriCounter] = useState(0);

  

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"))
    }
  }, []);

  useEffect(() => {
    //console.log(playlists)
    console.log(token)
    console.log(userId)
    console.log(year)
    console.log(season)
    console.log(validSongs);
    console.log(uriCounter)
  }, []);

  const handleGetPlaylists = () => {
    axios.get(PLAYLIST_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      for (var i=0; i < response.data["items"].length; i++) {
        var endpoint = response.data.items[i].tracks.href
        handleGetPlaylistDetails(endpoint)
      }
  
    })
    .catch((error) => {
      console.log(error)
    });
  }

  const handleGetPlaylistDetails = (playlistId) => {
    axios.get(playlistId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      //console.log(response.data)
      var songs = response.data.items
      let playlistURI = "";
      for (var i = 0; i < response.data.items.length; i++) {
        if ((songs[i].added_at).substring(0, 10) > "2021" + SPRING[0]) {
          playlistURI += songs[i]["track"]["uri"] + ", ";
        }
      }
      let temp = validSongs + playlistURI;
      setValidSongs(temp);
      console.log(validSongs.length)
      // setValidSongs(valid);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleGetUserId = () => {
    axios.get(USER_ID_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((id) => {
      setUserId(id.data["display_name"])
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleFilterPlaylists = () => {
    axios.get(GET_PLAYLIST_ITEMS_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((songs) => {
      //console.log(songs.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }


  return(
    <>
      <button onClick={() => {
        handleGetPlaylists();
        handleGetUserId();
        handleFilterPlaylists();
      }}>results</button>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="season-dropdown">
          Season
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setSeason("Winter")}>Winter</Dropdown.Item>
          <Dropdown.Item onClick={() => setSeason("Spring")}>Spring</Dropdown.Item>
          <Dropdown.Item onClick={() => setSeason("Summer")}>Summer</Dropdown.Item>
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