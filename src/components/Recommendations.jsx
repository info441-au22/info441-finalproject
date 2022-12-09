import React from 'react';
import { Flex, Button, Heading } from '@aws-amplify/ui-react';
import { DataGrid } from '@mui/x-data-grid';

export function Recommendations(props) {
  const dataTableArr = props.dataTableArr;
  const columns = props.columns;
  const handleGetRecommendationsCallback =
    props.handleGetRecommendationsCallback;
  const genreCheckboxComponent = props.genreCheckboxComponent;

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
        width={'1300px'}
      >
        <DataGrid
          rows={dataTableArr}
          columns={columns}
          checkboxSelection
          pageSize={5}
          rowHeight={100}
        />
      </Flex>
    </Flex>
  );
}

export default Recommendations;
