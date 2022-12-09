import React from 'react';
import { Flex, Button, Heading, TextField } from '@aws-amplify/ui-react';
import { DataGrid } from '@mui/x-data-grid';

export function Recommendations(props) {
  const dataTableArr = props.dataTableArr;
  const columns = props.columns;
  const handleGetRecommendationsCallback =
    props.handleGetRecommendationsCallback;
  const genreCheckboxComponent = props.genreCheckboxComponent;
  const setRecommendationsCallback = props.setRecommendationsCallback;
  const handleRecommendationPlaylistNameCallback = props.handleRecommendationPlaylistNameCallback;
  const createRecommendationPlaylistCallback = props.createRecommendationPlaylistCallback;
  const addSongsToRecommendationPlaylistCallback = props.addSongsToRecommendationPlaylistCallback;


  return (
    <Flex
      direction='column'
      justifyContent='center'
      alignItems='center'
      alignContent='center'
      wrap='nowrap'
      padding={'2rem'}
      gap='1rem'
    >
      <Heading level={1} justifyContent='center'>
        Select Your Genre
      </Heading>
      <Flex
        direction='row'
        justifyContent='center'
        alignItems='center'
        alignContent='center'
        wrap='nowrap'
        gap='1rem'
      >
        {genreCheckboxComponent}
      </Flex>
      <Button
        onClick={() => {
          handleGetRecommendationsCallback();
        }}
        variation='primary'
        size='large'
        ariaLabel="Add song's to playlist button"
      >
        GET SONG RECOMMENDATIONS
      </Button>
      <Flex
        direction='row'
        justifyContent='center'
        alignItems='center'
        alignContent='center'
        wrap='nowrap'
        gap='1rem'
        height={'625px'}
        width={'1760px'}
      >
        <DataGrid
          rows={dataTableArr}
          columns={columns}
          checkboxSelection
          pageSize={5}
          rowHeight={100}
          onSelectionModelChange={
            (items) => { 
              setRecommendationsCallback(items)
            }            
        }
        />
        <Flex direction={"column"} padding={"2rem"}>
          <TextField
            ariaLabel="Choose playlist name input"
            type="text"
            id="playlistName"
            name="playlistName"
            variation="quiet"
            placeholder="Choose a playlist name"
            isRequired={true}
            padding="1rem"
            onChange={(e) => handleRecommendationPlaylistNameCallback(e)}
          />
          <Button
            ariaLabel="Create Playlist Button"
            onClick={() => {
              createRecommendationPlaylistCallback();
            }}
          >
            Create Playlist
          </Button>
          <Button
            ariaLabel="Add songs Button"
            onClick={() => {
              addSongsToRecommendationPlaylistCallback();
            }}
          >
            Add songs to the playlist
          </Button>
        </Flex>
        
      </Flex>
    </Flex>
  );
}

export default Recommendations;
