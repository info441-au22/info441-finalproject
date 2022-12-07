import React from 'react'
import Modal from 'react-modal'
import { useEffect } from 'react';

function GettingStarted() {

    const [visible, setVisible] = React.useState(true);
    useEffect(()=>{
    let pop_status = localStorage.getItem('pop_status');
    if(!pop_status){
        setVisible(false);
        localStorage.setItem('pop_status',1);
    }
    },[])
    if(!visible) return (
        <button class='getting-started-btn' onClick={(openModal)}>Getting Started</button>
    );


  function closeModal() {
    setVisible(false);
  }

  function openModal() {
    setVisible(true)
  }

  return (
      <div> 
      <button class='getting-started-btn'>Getting Started</button>
      <Modal
        isOpen={visible}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        id='getting-started'
      >
        <div>
            <h2>Spotify Capsules</h2>
            <p>Welcome to our INFO 441 final project! The premise of our application is to provide users with a functionality that creates time or genre capsules based
                off of their listening history. After the user logs in, they can choose which ever option they want, whether they want to create a nostalgic playlist or
                one based off a mood. People are often curious about their listening habits and how it evolves may want to use our application as a way to look at that information,
                then use it to further explore possible music interests.
            </p>
            <h3>Instructions:</h3>
            <li>Select the "Time Capsule" or "Genre tab</li>
            <li>Login with your Spotify account</li>
            <li>Fill out the fields based on your preference</li>
            <li>Create Playlist!</li>
            <button class='getting-started-btn' onClick={closeModal}>Close</button>
        </div>
      </Modal>
      </div> 
  );
}

export default GettingStarted