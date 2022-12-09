import React, { useEffect, useState } from "react";
import {
    TextField,
    Flex,
    View,
    Button,
    Text,
  } from "@aws-amplify/ui-react";
import { Dropdown } from "react-bootstrap";

export function TimeCapsule(props) {

    //props constants
    const handleSongLimitAndRecommendationCallback = props.handleSongLimitAndRecommendationCallback;
    const songLimit = props.songLimit;
    const randomSongsLength = props.randomSongsLength;
    const handlePlaylistNameCallback = props.handlePlaylistNameCallback;
    const playListName = props.playListName;
    const playlistURIs = props.playlistURIs;
    const handleCreatePlaylistCallback = props.handleCreatePlaylistCallback;
    const handleAddSongsToPlaylistCallback = props.handleAddSongsToPlaylistCallback;

    const year = props.year;
    const season = props.season;
    console.log("Playlist URIs", playlistURIs);
    const years = props.years;
    const seasons = props.seasons;
    const dropDownOptionsComponent = props.dropDownOptionsComponent;
    const dropDownSeasonComponent = props.dropDownSeasonComponent
    const throwErrorState = props.throwErrorState;

    //state variables
    const [throwError, setThrowError] = useState(props.throwErrorState);
    
    return(
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            wrap="nowrap"
            gap="1rem"
          >
            {throwError === true && (
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
              borderRadius="6px"
              boxShadow="0 1px 2px rgba(0,0,0,0.07), 
                0 2px 4px rgba(0,0,0,0.07), 
                0 4px 8px rgba(0,0,0,0.07), 
                0 8px 16px rgba(0,0,0,0.07),
                0 16px 32px rgba(0,0,0,0.07), 
                0 32px 64px rgba(0,0,0,0.07)"
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
                {(season === "" || year === "") && (
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
                onChange={handleSongLimitAndRecommendationCallback}
                disabled={season === "" || year === ""}
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
                  processed is {randomSongsLength}. Max number of songs that can
                  be added at one time is 100.
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
                onChange={handlePlaylistNameCallback}
              />
              <br />
            </View>
            <Button
              onClick={() => {
                handleCreatePlaylistCallback();
                alert("Playlist created!");
              }}
              disabled={playListName === ""}
              ariaLabel="Create Playlist Button"
            >
              Create Playlist
            </Button>
            <View>
              <br />
              <Button
                onClick={() => {
                  handleAddSongsToPlaylistCallback();
                  //setPlaylistURIs("");
                }}
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
    )
}

export default TimeCapsule;