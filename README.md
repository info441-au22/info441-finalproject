# Project Description 
### [click here to visit our live demo](https://spotify-recap.parsak.me/)

For our project proposal, our target audience is going to be Spotify users. We envision Spotify users that are interested in viewing their analytics using our application to gain further insight on the things they listen to. People curious about their listening habits and how it evolves may want to use our application as a way to look at that information, then use it to further explore possible music interests. 

We ourselves as Spotify users have come across the problem of not being able to easily view the statistics associated with the music we listen to, except when Spotify Wrapped gets released at the end of each year. We know Spotify Wrapped is successful as at the end of every year it's not uncommon to see users sharing their stats across social media, and believe that it would be beneficial to have a way to view stats like the ones Spotify Wrapped provides at any given time through our application. No longer would the users be at the mercy of when Spotify decides to release Spotify Wrapped in seeing how their music listening habits have changed. Anyone who wants to view their stats would be able to through what our application provides.

We believe that a lot of Spotify users would find this application beneficial, and want to be able to view their listening habits and see the 
statistics associated with what type of music they listen to. Having the ability to further explore those statistics with the ability to look at certain time frames, genres, playlists, etcetera would enable users to find more music aligned with their interests.

# Architectural Diagram
[Latest Version of Diagram](https://drive.google.com/file/d/1w2agbpS1FLcfwB96QfJlsfnvM6AnF0ey/view)

# User Stories

|Priority|User|Description|Technical Implementation| 
|--------|----|-----------|------------------------|
|P0|As a user|I want to be able to login with Spotify|Spotify Authentication| 
|P0|As a user|As a Spotify user, I want to be able to select a time frame and create a randomized “Spotify Time Capsule” playlist from my library.|Grab songs that the user added to any of their playlists during the chosen time period from Spotify’s API (Get), and POST the songs to a playlist in the users library through the same API.
|P1|As a user|As a Spotify user, I want to be able to select genres and view recommendations that are curated from my playlist libraries artists and genres.|Grab genres that the user listens to and allow them to choose from them, then randomly select five artists and songs from the user’s library to generate a seed that is sent to Spotify’s API (Get). POST the songs to a table in the UI that lets the user see their recommendations.


# Features

**1: Accounts** - Spotify user account auth that allows Capsules to export into your Spotify playlists library.

**2: "Time Capsule" functionality** - Let user select a given season and year, then create a random playlist of songs from that period that were in the users song library.

**3: "Recommendations" functionality** - Let user select from relevant genres, then create a list of recommended songs from those genres utilizing a unique seed tied to artists, songs, and genres the user has in their playlists library.

# Tech

**Hosting:** Azure

**Auth:** Spotify Auth 

**Tech:** Reactjs, MongoDB, Axios and Spotify API

**Styling:** AmplifyUI


# Endpoints

**/signin**

POST: Sign in

**/signout**

POST: Sign out


**api.spotify.com/v1/me**

GET: Get userId (after auth)


**api.spotify.com/v1/playlists/**

GET: Retrieve 50 playlists from users playlist library (or as many as exist) 


**api.spotify.com/v1/playlists/:playlistId

GET: Retrieve a maximum of 100 songs from a playlist


**api.spotify.com/v1/users/:userId/playlists**

POST: Using userId of logged in user, create a new Spotify playlist


**api.spotify.com/v1/playlists/:createdPlaylistId/tracks**

POST: Using createdPlaylistId, populated the playlist with capsule of songs.

# Database Schema (MongoDB)

#### User
- User ID

#### Songs
- Song URI

#### Artists
- Artist URI

#### Playlists
- Playlist ID

###### **Note:** Why didn't we used saved songs? We explored this- We know not everybody makes playlists, but Spotify API has limitations in place for retrieving a users saved songs. With the current functionality they offer, we could only process 50 saved songs at a time. With playlists we are also limited to 50, but with 50 playlists we are able to offer a lot more variety then with 50 songs.
