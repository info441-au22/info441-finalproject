import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { TextField, Flex, View, Button, Text, CheckboxField, Tabs, TabItem, Heading } from "@aws-amplify/ui-react";

const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists?limit=50";
const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";
const GET_PLAYLIST_ITEMS_ENDPOINT =
  "https://api.spotify.com/v1/playlists/2qFDu3xwuUBPaVs7gsD9jh/tracks"; //(not used yet)
const ADD_SONGS_TO_PLAYLIST = "https://api.spotify.com/v1/playlists/";
const CREATE_CUSTOM_PLAYLIST = "https://api.spotify.com/v1/users/";


let playlistURI = [];

function Filters() {
  const [token, setToken] = useState("");
  const [validSongs, setValidSongs] = useState("");
  const [userId, setUserId] = useState({});
  const [year, setYear] = useState("");
  const [season, setSeason] = useState("");
  const [createdPlaylistId, setCreatedPlaylistId] = useState("");
  const [playListName, setPlaylistName] = useState("");
  const [selectYear, handleSelectYear] = useState(false);
  const [selectSeason, handleSelectSeason] = useState(false);
  const [songLimit, setSongLimit] = useState(1);
  const [gatherSongs, handleGatherSongs] = useState(false);
  const [randomSongsLength, setRandomSongsLength] = useState(0);
  const [playlistURIs, setPlaylistURIs] = useState("");
  const [throwError, setThrowError] = useState(false);
  const [selectGenreMap, setSelectedGenreMap] = useState(new Map());

  //For recommendations
  const [userSongsList, setUserSongsList] = useState([]);
  const [userArtistList, setUserArtistList] = useState([]);
  const [userGenresArr, setUserGenresArr] = useState([]);

  const GET_RECOMMENDATIONS = "https://api.spotify.com/v1/recommendations/?seed_artists=" + userArtistList.slice(0,1).join(",") + "&seed_genres=" + 
                              userGenresArr + "&seed_tracks=" + userSongsList[0] + "&limit=50";
  

  // from: https://stackoverflow.com/questions/40263803/native-javascript-or-es6-way-to-encode-and-decode-html-entities
  const escapeHTML = (str) =>
    !str
      ? str
      : str.replace(
          /[&<>'"]/g,
          (tag) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              "'": "&#39;",
              '"': "&quot;",
            }[tag])
        );

  const handlePlaylistName = (e) => {
    setPlaylistName(escapeHTML(e.target.value));
  };

  const handleSongLimit = (e) => {
    playlistURI = [];
    setSongLimit(escapeHTML(e.target.value));
    // if theres more available random songs then is the limit set by the user we can run the handlers
    if (escapeHTML(e.target.value) > 100 || songLimit > 100) {
      setSongLimit(100);
      handleGetPlaylists();
      handleGetUserId();
    } else if (escapeHTML(e.target.value) === 0) {
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

  const years = [2019, 2020, 2021, 2022];
  const seasons = ["Spring", "Summer", "Fall", "Winter"];
  const genres = ["classical", "hip-hop", "chill", "alternative", "disco", "afro-beat"];
  const date_constants = new Map();
  for (let i = 0; i < years.length; i++) {
    date_constants.set(years[i], {
      Winter: {
        start: years[i] + "-12-21T00:00:00Z",
        end: years[i + 1] + "-03-19T00:00:00Z",
      },
      Spring: {
        start: years[i] + "-03-20T00:00:00Z",
        end: years[i] + "-06-20T00:00:00Z",
      },
      Summer: {
        start: years[i] + "-06-21T00:00:00Z",
        end: years[i] + "-09-21T00:00:00Z",
      },
      Fall: {
        start: years[i] + "-09-22T00:00:00Z",
        end: years[i] + "-12-20T00:00:00Z",
      },
    });
  }

  const dropDownOptionsComponent = years.map((year) => {
    return (
      <Dropdown.Item
        onClick={() => {
          setYear(year);
          handleSelectYear(true);
          setPlaylistURIs("");
        }}
      >
        {year}
      </Dropdown.Item>
    );
  });

  const dropDownSeasonComponent = seasons.map((season) => {
    return (
      <Dropdown.Item
        onClick={() => {
          setSeason(season);
          handleSelectSeason(true);
          setPlaylistURIs("");
        }}
      >
        {season}
      </Dropdown.Item>
    );
  });

  const genreCheckboxComponent = genres.map((genre) => {
    return(
      <CheckboxField
          label={genre}
          name={genre}
          value={genre}
          size="default"
          onChange={(e) => {if(e.target.checked === true) {setUserGenresArr([...userGenresArr, e.target.value])}}}
      />
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

  const handleGetRecommendations = () => {
    axios
      .get(GET_RECOMMENDATIONS, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log("Recommendations = ", response);
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
          // for (let i = 0; i < 5; i++) {
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
        //for recommendations
        songs.forEach((song) => {
          setUserSongsList(userSongsList => [...userSongsList, song.track.uri.substring(14, song.track.uri.length - 1)]);
          setUserArtistList(userArtistList => [...userArtistList, song.track.artists[0].uri.substring(15, song.track.uri.length - 1)]);
        })
       
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
          () => 0.045 - Math.random()
        );

        let random_songs_arr = [];
        let counter = 0;

        if (shuffled_time_frame.length !== 0) {
          shuffled_time_frame.forEach(
            (song) => {
              random_songs_arr.push(song);
              counter++;
            }
            // }
          );
        } else if (shuffled_time_frame.length === 0 && counter === 0) {
        } else if (shuffled_time_frame.length === 0 && counter !== 0) {
        } else {
          setRandomSongsLength(0);
        }

        let playlist_random_uri = [];

        for (let i = 0; i < songLimit; i++) {
          playlist_random_uri.push(random_songs_arr[i].track.uri.toString());
        }

        // console.log(playlistURI); // what does this return?
        // (ex: {[[uri][uri][uri]], [[uri][uri]], [uri]}) we only get 3 when its 6 uris... lets fix this
        playlistURI.push(playlist_random_uri); //
        // take playlistURI object of arrays {[],[],[]}, and convert it into an array of string arrays [[]],[]],[]]]
        let stringOfArrays = []; // now convert to single array, string of URIs separated by ',' ['uri,uri,uri']
        for (const key in playlistURI) {
          stringOfArrays.push(playlistURI[key].toString());
        }

        // we want to take the string thats separated by ',' then make it back into an array so that we can grab its length
        // and see how many random songs we have returned in total
        stringOfArrays = stringOfArrays.toString();
        let countURIsFromArray = 0;
        const splitURIsInString = stringOfArrays.split(",");
        countURIsFromArray = splitURIsInString.length;
        console.log(countURIsFromArray);
        console.log(splitURIsInString);
        setRandomSongsLength(countURIsFromArray);
        // go to create playlist handler for rest of code
        setPlaylistURIs(splitURIsInString);

        // 	https://api.spotify.com/v1/playlists/{playlist_id}/tracks
        // POST Docs:
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
        // stuff to add songs to a newly created playlist
      })
      .catch((error) => {
        console.log(error);
        if (songLimit > randomSongsLength && randomSongsLength > 0) {
          setSongLimit(randomSongsLength);
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
      setSongLimit(songLimit);
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
      method: "post",
      url: ADD_SONGS_TO_PLAYLIST + createdPlaylistId + "/tracks",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: data,
    };
    axios(config)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        // alert();
        console.error(
          "You don't have any songs for the selected time frame. Select a different season and/or year, then gather songs and add to the playlist again."
        );
        setThrowError(true);
      });
  };

  const handleCreatePlaylist = () => {
    let data = {
      name: playListName,
      description:
        "To be filled in with randomized songs from a given time period.",
    };
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

  return (
    <div>
      <Tabs justifyContent="flex-start">
        <TabItem title="Time Capsule">
        <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        gap="1rem"
      >
        {throwError == true && (
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            wrap="nowrap"
            gap="1rem"
            padding="2rem"
          >
            <View>
              <Text
                variation="primary"
                as="p"
                color="red"
                lineHeight="1.2rem"
                fontWeight={400}
                fontSize="0.75rem"
                fontStyle="normal"
                textDecoration="none"
                ariaLabel="Invalid time frame or no songs"
                textAlign="center"
              >
                Error: You are either rate limited or choose an invalid time
                period/one with no songs. <br /> Choose a different time
                period/give time for the rate limit reset. D:
              </Text>
            </View>
            <Button
              alignContent="center"
              onClick={() => {
                setThrowError(false);
                window.location.reload();
              }}
            >
              OK
            </Button>
          </Flex>
        )}

        <View
          as="div"
          border="1px solid var(--amplify-colors-black)"
          borderRadius="6px"
          boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
          padding="1rem"
        >
          <Text
            variation="primary"
            as="p"
            color="#188754"
            lineHeight="1.2rem"
            fontWeight={400}
            fontSize="0.75rem"
            fontStyle="normal"
            textDecoration="none"
            width="30vw"
            ariaLabel="Maximum number of songs dynamic field"
          ></Text>
          <View as="div" padding="1rem">
            <Dropdown style={{ paddingBottom: "1rem" }}>
              <Dropdown.Toggle variant="success" id="season-dropdown">
                SEASON
              </Dropdown.Toggle>
              <Dropdown.Menu>{dropDownSeasonComponent}</Dropdown.Menu>
            </Dropdown>
            <Dropdown style={{ paddingBottom: "1rem" }}>
              <Dropdown.Toggle variant="success" id="year-dropdown">
                YEAR
              </Dropdown.Toggle>
              <Dropdown.Menu>{dropDownOptionsComponent}</Dropdown.Menu>
            </Dropdown>
            {season !== "" && year !== "" && (
              <Text
                variation="primary"
                as="p"
                color="#188754"
                lineHeight="2rem"
                fontWeight={500}
                fontSize="1rem"
                fontStyle="normal"
                textDecoration="none"
                width="30vw"
                ariaLabel="Maximum number of songs dynamic field"
              >
                Your time frame is {season}, {year}.
              </Text>
            )}
            {season === "" && year === "" && (
              <Text
                variation="primary"
                as="p"
                color="#000000"
                lineHeight="2rem"
                fontWeight={500}
                fontSize="1rem"
                fontStyle="normal"
                textDecoration="none"
                width="30vw"
                ariaLabel="Maximum number of songs dynamic field"
              >
                You haven't selected the season or year.
              </Text>
            )}
          </View>

          <TextField
            ariaLabel="# of songs to add to playlist input"
            type="number"
            id="songLimit"
            name="songLimit"
            variation="quiet"
            placeholder="# of Songs to add to Playlist"
            onChange={handleSongLimit}
            padding="1rem"
            isRequired={true}
          />
          {songLimit % 1 !== 0 && (
            <Text
              variation="primary"
              as="p"
              color="red"
              lineHeight="1.2rem"
              fontWeight={400}
              fontSize="0.75rem"
              fontStyle="normal"
              textDecoration="none"
              width="30vw"
              paddingLeft="1rem"
              paddingBottom="0.5rem"
              ariaLabel="Maximum number of songs dynamic field"
            >
              Please don't use decimal numbers.
            </Text>
          )}
          {randomSongsLength > 0 && (
            <Text
              variation="primary"
              as="p"
              color="#188754"
              lineHeight="1.2rem"
              fontWeight={400}
              fontSize="0.75rem"
              fontStyle="normal"
              textDecoration="none"
              width="30vw"
              paddingLeft="1rem"
              paddingBottom="0.5rem"
              ariaLabel="Maximum number of songs dynamic field"
            >
              Number of songs is set to {songLimit}. Number of random songs
              processed is {randomSongsLength}. Max number of songs that can be
              added at one time is 100.
            </Text>
          )}

          <br />
          <TextField
            ariaLabel="Choose playlist name input"
            type="text"
            id="playlistName"
            name="playlistName"
            variation="quiet"
            placeholder="Choose a playlist name"
            isRequired={true}
            padding="1rem"
            onChange={handlePlaylistName}
          />
          <br />
        </View>
        <Button
          onClick={() => {
            handleCreatePlaylist();
            alert("Playlist created!");
            console.log("Playlist URI create playlist button = ", playlistURIs);
          }}
          disabled={gatherSongs || playListName === ""}
          ariaLabel="Create Playlist Button"
        >
          Create Playlist
        </Button>
        <View>
          <br />
          <Button
            onClick={() => {
              handleAddSongsToPlaylist();
              console.log("Playlist URI add songs button = ", playlistURIs);
              setPlaylistURIs("");
              alert("Songs were added to the playlist!");
              // window.location.reload();
            }}
            disabled={gatherSongs}
            variation="primary"
            size="large"
            ariaLabel="Add song's to playlist button"
          >
            ADD SONGS TO PLAYLIST
          </Button>
        </View>
        <View>
          <Text
            variation="primary"
            as="p"
            color="#188754"
            lineHeight="1.2rem"
            fontWeight={400}
            fontSize="0.75rem"
            fontStyle="normal"
            textDecoration="none"
            ariaLabel="Songs may repeat warning"
          >
            Songs may repeat based on users library size.
          </Text>
        </View>
      </Flex>
        </TabItem>
        <TabItem title="Recommendations">
        <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        padding={"2rem"}
        gap="1rem"
        >
          <Heading
            level={1} 
            justifyContent="center"
          >
            Select Your Genre
          </Heading>
          <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          wrap="nowrap"
          gap="1rem"
          >
            {genreCheckboxComponent}
          </Flex>
          <Button
            onClick={() => {
              // const genresSelected = [];
              // const genre_keys = selectGenreMap.keys();
              // for(let i = 0; i < selectGenreMap.size; i++) {
              //   const genre = genre_keys.next().value;
              //   if(selectGenreMap.get(genre) === true) {
              //     genresSelected.push(genre);
              //   }
              // }
              // setUserGenresArr([...userGenresArr, genresSelected])
              console.log(userGenresArr);
              handleGetRecommendations();
              setUserGenresArr([]);
            }}
            variation="primary"
            size="large"
            ariaLabel="Add song's to playlist button"
          >
            GET SONG RECOMMENDATIONS
          </Button>
        </Flex>
        </TabItem>
      </Tabs>
    </div>
  );
}

export default Filters;
