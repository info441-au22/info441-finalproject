import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, TabItem, CheckboxField } from '@aws-amplify/ui-react';
import { Dropdown } from 'react-bootstrap';
import { TimeCapsule } from './TimeCapsule.jsx';
import { Recommendations } from './Recommendations.jsx';
import models from '../models/models.js';

const PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/me/playlists?limit=50';
const USER_ID_ENDPOINT = 'https://api.spotify.com/v1/me';
const ADD_SONGS_TO_PLAYLIST = 'https://api.spotify.com/v1/playlists/';
const CREATE_CUSTOM_PLAYLIST = 'https://api.spotify.com/v1/users/';

let playlistURI = [];

function Filters() {
  // For Time Capsule
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState({});
  const [createdPlaylistId, setCreatedPlaylistId] = useState('');
  const [playListName, setPlaylistName] = useState('');
  const [songLimit, setSongLimit] = useState(1);
  const [randomSongsLength, setRandomSongsLength] = useState(0);
  const [playlistURIs, setPlaylistURIs] = useState('');
  const [throwError, setThrowError] = useState(false);
  const [createdPlaylistIdsCount, setCreatedPlaylistIdsCount] = useState(
    getPlaylistIDCount()
  );

  // For Recommendations
  const [userSongsList, setUserSongsList] = useState([]);
  const [userArtistList, setUserArtistList] = useState([]);
  const [userGenresArr, setUserGenresArr] = useState([]);
  const [dataTableArr, setDataTableArr] = useState([]);
  const [recommendationsURI, setRecommendationsURI] = useState([]);
  const [recommendationPlaylistName, setRecommendationPlaylistName] =
    useState('');
  const [recommendationPlaylistID, setRecommendationPlaylistID] = useState('');
  const [checkboxCounter, setCheckboxCounter] = useState(0);
  const [handlePlaylistNameCheck, setHandlePlaylistNameCheck] = useState(true);
  const [handleCreatePlaylistCheck, setCreatePlaylistCheck] = useState(true);
  const [handleAddSongsButton, setAddSongsButton] = useState(true);

  const [year, setYear] = useState('');
  const [season, setSeason] = useState('');
  // Const Arrays for Components
  const years = [2019, 2020, 2021, 2022];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const genres = [
    'classical',
    'hip-hop',
    'chill',
    'alternative',
    'disco',
    'afro-beat',
  ];

  // Years Drop Down Component
  const dropDownOptionsComponent = years.map((year) => {
    return (
      <Dropdown.Item
        onClick={() => {
          setYear(year);
        }}
      >
        {year}
      </Dropdown.Item>
    );
  });

  // Seasons Drop Down Component
  const dropDownSeasonComponent = seasons.map((season) => {
    return (
      <Dropdown.Item
        onClick={() => {
          setSeason(season);
        }}
      >
        {season}
      </Dropdown.Item>
    );
  });

  // Checkbox for Genres
  const genreCheckboxComponent = genres.map((genre) => {
    return (
      <CheckboxField
        label={genre}
        name={genre}
        value={genre}
        size='default'
        onChange={(e) => {
          if (e.target.checked === true) {
            setUserGenresArr([...userGenresArr, e.target.value]);
            setCheckboxCounter(checkboxCounter + 1);
          } else if (e.target.checked === false) {
            setCheckboxCounter(checkboxCounter - 1);
            setUserGenresArr((gen) =>
              gen.filter((check) => e.target.value !== check)
            );
          }
        }}
      />
    );
  });

  const [recommendationTab, setRecommendationTab] = useState(false);
  const GET_RECOMMENDATIONS =
    'https://api.spotify.com/v1/recommendations/?seed_artists=' +
    userArtistList.slice(0, 1).join(',') +
    '&seed_genres=' +
    userGenresArr +
    '&seed_tracks=' +
    userSongsList[0] +
    '&limit=20';

  const setRecommendationsCallback = (items) => {
    dataTableArr.forEach((track) => {
      if (items.includes(track.id)) {
        setRecommendationsURI([...recommendationsURI, track.uri]);
      }
    });
  };

  const handleRecommendationPlaylistNameCallback = (e) => {
    setRecommendationPlaylistName(e.target.value);
  };
  // Columns for the Data Table
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'uri',
      headerName: 'URI',
      width: 0,
      hide: true,
    },
    {
      field: 'name',
      headerName: 'Track Name',
      width: 200,
    },
    {
      field: 'artists',
      headerName: 'Artist/Artists',
      width: 250,
    },
    {
      field: 'album',
      headerName: 'Album',
      width: 250,
    },
    {
      field: 'image',
      headerName: 'Album Cover',
      width: 150,
      renderCell: (params) => (
        <img
          height='80px'
          alt='Album Cover'
          width='80px'
          src={params.row.image}
        />
      ),
    },
    {
      field: 'release_date',
      headerName: 'Release Date',
    },
    {
      field: 'popularity',
      headerName: 'Popularity(0-100)',
      sortable: true,
      width: 150,
    },
    {
      field: 'song_link',
      headerName: 'Song Link',
      renderCell: (params) => (
        <a href={params.row.song_link} target='_blank' rel='noreferrer'>
          Link
        </a>
      ),
      width: 150,
    },
  ];

  // Address Cross Site Scripting Vulnerabilities
  // from: https://stackoverflow.com/questions/40263803/native-javascript-or-es6-way-to-encode-and-decode-html-entities
  const escapeHTML = (str) =>
    !str
      ? str
      : str.replace(
          /[&<>'"]/g,
          (tag) =>
            ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              "'": '&#39;',
              '"': '&quot;',
            }[tag])
        );

  // disables recommendations until user inputs song limit and time frame
  const handleSongLimitAndRecommendation = (e) => {
    handleSongLimit(e);
    setRecommendationTab(true);
  };

  // sets the playlist name to the input field value
  const handlePlaylistName = (e) => {
    setPlaylistName(escapeHTML(e.target.value));
  };

  // sets the song limit to the input field value and handles some error cases
  const handleSongLimit = (e) => {
    playlistURI = [];
    setSongLimit(escapeHTML(e.target.value));
    if (escapeHTML(e.target.value) > 100 || songLimit > 100) {
      setSongLimit(100);
      handleGetPlaylists();
      handleGetUserId();
    } else if (
      escapeHTML(e.target.value) === 0 ||
      escapeHTML(e.target.value) === ''
    ) {
      setSongLimit(0);
    } else if (
      randomSongsLength > songLimit &&
      randomSongsLength > 0 &&
      songLimit < 100
    ) {
      // if user goes over limit of random songs, set song limit back to max number of random songs
      setSongLimit(escapeHTML(e.target.value));
      handleGetPlaylists();
      handleGetUserId();
    } else if (!escapeHTML(e.target.value)) {
      // for when user erases # of songs completely, set to 0 instead of empty ""
      setSongLimit(0);
    } else {
      // for when user modifies input, show max # of songs one can add and what current number of songs is set to for user
      setSongLimit(escapeHTML(e.target.value));
      handleGetPlaylists();
      handleGetUserId();
    }
  };

  //arrays for components

  //Dates map for time frame functions
  const date_constants = new Map();
  for (let i = 0; i < years.length; i++) {
    date_constants.set(years[i], {
      Winter: {
        start: years[i] + '-12-21T00:00:00Z',
        end: years[i + 1] + '-03-19T00:00:00Z',
      },
      Spring: {
        start: years[i] + '-03-20T00:00:00Z',
        end: years[i] + '-06-20T00:00:00Z',
      },
      Summer: {
        start: years[i] + '-06-21T00:00:00Z',
        end: years[i] + '-09-21T00:00:00Z',
      },
      Fall: {
        start: years[i] + '-09-22T00:00:00Z',
        end: years[i] + '-12-20T00:00:00Z',
      },
    });
  }

  // Grab the user's spotify access token from local storage (this is after you press the log in button)
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setToken(localStorage.getItem('accessToken'));
    }
  }, []);

  // Handles the recommendation endpoint
  const handleGetRecommendations = () => {
    axios
      .get(GET_RECOMMENDATIONS, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        const tracks = response.data.tracks;
        const temp_arr = [];
        let count = 1;
        tracks.forEach((song) => {
          const songTableObject = {
            id: count,
            uri: song.uri,
            name: song.name,
            artists: song.artists[0].name,
            album: song.album.name,
            image: song.album.images[0].url,
            release_date: song.album.release_date,
            popularity: song.popularity,
            song_link: song.external_urls.spotify,
          };
          temp_arr.push(songTableObject);
          count++;
        });
        setDataTableArr(temp_arr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handles the get playlists endpoint
  const handleGetPlaylists = () => {
    axios
      .get(PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        for (let i = 0; i < response.data['items'].length; i++) {
          let playlistEndpoint = response.data.items[i].tracks.href;
          handleGetPlaylistDetails(playlistEndpoint);
        }
      })
      .catch((error) => {
        console.log('server side error in handleGetPlaylists: ' + error);
      });
  };

  // handleGetPlaylist is getting the songs from each playlist that is passed through
  const handleGetPlaylistDetails = (playlistId) => {
    axios
      .get(playlistId, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        let songs = response.data.items;
        songs.forEach((song) => {
          setUserSongsList((userSongsList) => [
            ...userSongsList,
            song.track.id,
          ]);
          setUserArtistList((userArtistList) => [
            ...userArtistList,
            song.track.artists[0].id,
          ]);
        });

        function withinTimeframe(song) {
          const date_added = new Date(song.added_at);
          return (
            Date.parse(date_added) >
              Date.parse(date_constants.get(year)[season].start) &&
            Date.parse(date_added) <
              Date.parse(date_constants.get(year)[season].end)
          );
        }
        const songs_time_frame = songs.filter((song) => withinTimeframe(song));
        const shuffled_time_frame = [...songs_time_frame].sort(
          () => 0.025 - Math.random()
        );

        let random_songs_arr = [];
        let counter;
        if (shuffled_time_frame.length !== 0) {
          shuffled_time_frame.forEach((song) => {
            random_songs_arr.push(song);
            counter++;
          });
        } else if (shuffled_time_frame.length === 0 && counter === 0) {
        } else if (shuffled_time_frame.length === 0 && counter !== 0) {
        } else {
          setRandomSongsLength(0);
        }

        let playlist_random_uri = [];
        for (let i = 0; i < songLimit; i++) {
          playlist_random_uri.push(random_songs_arr[i].track.uri.toString());
        }
        playlistURI.push(playlist_random_uri);
        let stringOfArrays = [];
        for (const key in playlistURI) {
          stringOfArrays.push(playlistURI[key].toString());
        }
        stringOfArrays = stringOfArrays.toString();
        let countURIsFromArray = 0;
        const splitURIsInString = stringOfArrays.split(',');
        countURIsFromArray = splitURIsInString.length;
        setRandomSongsLength(countURIsFromArray);
        setPlaylistURIs(splitURIsInString);
      })
      .catch((error) => {
        console.log(error); // happens during rate limit/if api cant keep up
        if (songLimit > randomSongsLength && randomSongsLength > 0) {
          setSongLimit(100);
        }
      });
  };

  const handleAddSongsToPlaylist = () => {
    let newPlaylistURIs = [];
    if (songLimit > 100) {
      for (let i = 0; i < songLimit; i++) {
        newPlaylistURIs.push(playlistURIs[i]);
      }
      setSongLimit(100);
      setPlaylistURIs(newPlaylistURIs);
    } else if (randomSongsLength > 100) {
      for (
        let i = randomSongsLength - 1;
        i > randomSongsLength - songLimit - 1;
        i--
      ) {
        newPlaylistURIs.push(playlistURIs[i]);
      }
      setPlaylistURIs(newPlaylistURIs);
    } else {
      for (let i = 0; i < songLimit; i++) {
        newPlaylistURIs.push(playlistURIs[i]);
      }
      setPlaylistURIs(newPlaylistURIs);
    }
    let data = JSON.stringify({
      uris: newPlaylistURIs,
      position: 0,
    });
    let config = {
      method: 'post',
      url: ADD_SONGS_TO_PLAYLIST + createdPlaylistId + '/tracks',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: data,
    };
    axios(config)
      .then((response) => {})
      .catch((error) => {
        setThrowError(true);
        console.log(error);

        console.error(
          "You don't have any songs for the selected time frame. You may be rate limited. Select a different season and/or year, then gather songs and add to the playlist again."
        );
      });
  };

  const createRecommendationPlaylist = () => {
    let data = {
      name: recommendationPlaylistName,
      description: 'To be filled in with user picked recommendations.',
    };
    let config = {
      method: 'post',
      url: CREATE_CUSTOM_PLAYLIST + userId + '/playlists',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        setRecommendationPlaylistID(response.data.id);
        postPlaylistID(response.data.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addSongsToRecommendationPlaylist = () => {
    let data = JSON.stringify({
      uris: recommendationsURI,
      position: 0,
    });
    let config = {
      method: 'post',
      url: ADD_SONGS_TO_PLAYLIST + recommendationPlaylistID + '/tracks',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: data,
    };
    axios(config)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCreatePlaylist = () => {
    let data = {
      name: playListName,
      description:
        'To be filled in with randomized songs from a given time period.',
    };
    let config = {
      method: 'post',
      url: CREATE_CUSTOM_PLAYLIST + userId + '/playlists',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        setCreatedPlaylistId(response.data.id);
        postPlaylistID(response.data.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleGetUserId = () => {
    axios
      .get(USER_ID_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((id) => {
        setUserId(id.data['id']);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function getPlaylistIDCount() {
    // Make a GET request to localhost:8080 to fetch the playlistId
    axios
      .get('http://localhost:8080/api/playlists/playlistIds') // change when hosting
      .then((response) => {
        setCreatedPlaylistIdsCount(response.data.count);
        // If the request was successful, log to the console
      })
      .catch((error) => {
        // If there was an error, log it to the console
        // console.log(error);
      });
  }

  function postPlaylistID(playlistId) {
    var data = JSON.stringify({
      playlistId,
    });

    var config = {
      method: 'post',
      url: 'http://localhost:8080/api/playlists/', // change when hosting
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        getPlaylistIDCount();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <Tabs padding='2rem' justifyContent='center'>
        <TabItem title='Time Capsule'>
          <TimeCapsule
            handleSongLimitAndRecommendationCallback={
              handleSongLimitAndRecommendation
            }
            songLimit={songLimit}
            randomSongsLength={randomSongsLength}
            handlePlaylistNameCallback={handlePlaylistName}
            playlistName={playListName}
            handleCreatePlaylistCallback={handleCreatePlaylist}
            handleAddSongsToPlaylistCallback={handleAddSongsToPlaylist}
            dropDownOptionsComponent={dropDownOptionsComponent}
            dropDownSeasonComponent={dropDownSeasonComponent}
            year={year}
            season={season}
            throwErrorState={throwError}
            createdPlaylistIdsCount={createdPlaylistIdsCount}
          />
        </TabItem>
        <TabItem disabled={!recommendationTab} title='Recommendations'>
          <Recommendations
            dataTableArr={dataTableArr}
            columns={columns}
            handleGetRecommendationsCallback={handleGetRecommendations}
            genreCheckboxComponent={genreCheckboxComponent}
            setRecommendationsCallback={setRecommendationsCallback}
            handleRecommendationPlaylistNameCallback={
              handleRecommendationPlaylistNameCallback
            }
            createRecommendationPlaylistCallback={createRecommendationPlaylist}
            addSongsToRecommendationPlaylistCallback={
              addSongsToRecommendationPlaylist
            }
            checkboxCounter={checkboxCounter}
            setHandlePlaylistNameCheck={setHandlePlaylistNameCheck}
            setCreatePlaylistCheck={setCreatePlaylistCheck}
            handleCreatePlaylistCheck={handleCreatePlaylistCheck}
            handlePlaylistNameCheck={handlePlaylistNameCheck}
            setAddSongsButton={setAddSongsButton}
            handleAddSongsButton={handleAddSongsButton}
            setRecommendationsURI={setRecommendationsURI}
          />
        </TabItem>
      </Tabs>
    </div>
  );
}

export default Filters;
