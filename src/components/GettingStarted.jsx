import React from 'react';
import Modal from 'react-modal';
import { useEffect } from 'react';
import { Flex, Button } from '@aws-amplify/ui-react';

function GettingStarted() {
  const [visible, setVisible] = React.useState(true);
  const customStyles = {
    content: {
      width: '600px',
      height: '500px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: '5rem',
      transform: 'translate(-50%, -50%)',
    },
  };
  useEffect(() => {
    let pop_status = localStorage.getItem('pop_status');
    if (!pop_status) {
      setVisible(false);
      localStorage.setItem('pop_status', 1);
    }
  }, []);
  if (!visible)
    return (
      <Flex
        direction='column'
        justifyContent='center'
        alignItems='center'
        alignContent='center'
        wrap='nowrap'
        padding='2rem'
      >
        <Button
          variation='primary'
          size='default'
          ariaLabel='Getting Started Button'
          onClick={openModal}
        >
          GETTING STARTED
        </Button>
      </Flex>
    );

  function closeModal() {
    setVisible(false);
  }

  function openModal() {
    setVisible(true);
  }

  return (
    <Flex
      direction='column'
      justifyContent='center'
      alignItems='center'
      alignContent='center'
      wrap='nowrap'
      padding='2rem'
    >
      <Button
        variation='primary'
        size='default'
        ariaLabel='Getting Started Button'
        onClick={openModal}
      >
        GETTING STARTED
      </Button>

      <Modal
        style={customStyles}
        isOpen={visible}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        id='getting-started'
      >
        <div>
          <h2>Spotify Capsules</h2>
          <p>
            Welcome to our INFO 441 final project! The premise of our
            application is to provide users with a functionality that creates
            time or genre capsules based off of their listening history. After
            the user logs in, they can choose which ever option they want,
            whether they want to create a nostalgic playlist or one based off a
            mood. People are often curious about their listening habits and how
            it evolves may want to use our application as a way to look at that
            information, then use it to further explore possible music
            interests.
          </p>
          <h3>Instructions</h3>
          <li>Select the "Time Capsule" or "Genre tab</li>
          <li>Login with your Spotify account</li>
          <li>Fill out the fields based on your preference</li>
          <li>Create Playlist!</li>
          <Button
            id='close-button'
            variation='primary'
            size='small'
            ariaLabel='Close button'
            onClick={closeModal}
            marginTop='1rem'
          >
            CLOSE
          </Button>
        </div>
      </Modal>
    </Flex>
  );
}

export default GettingStarted;
