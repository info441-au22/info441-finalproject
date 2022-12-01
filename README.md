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
|P0|As a user|I want to be able to select a time frame and create a randomized “Spotify capsules” playlist from the users library that is shareable and filterable.|Grab songs that the user added to any of their playlists during the given metric  from Spotify’s API (Get), and POST the songs to a playlist in the users library through the same API.
|P1|As a user|I want to be able to select a genre and create a randomized “Spotify capsules” playlist from the users library that is shareable and filterable.|Grab songs that the user added to any of their playlists during the given metric  from Spotify’s API (Get), and POST the songs to a playlist in the users library through the same API. 
|P2|As a user|I want to be able to create/save a current “leaderboard” of most played and least played songs from my library which can appear to friends.|Grab user stat data from Spotify’s API, and POST the snapshot to the user database.|
|P3|As a user|I want to be able to share my leaderboard with others|Generate a shareable screenshot OR public link to view friend’s leaderboard|
|P4|As a user|I want to be able to check other friend’s leaderboards, Spotify capsules, and public profiles.|Display all of the leaderboards, Spotify capsules, and their public profile to the user’s friends entries in the database (GET request).|

# Features

**1: "Capsules" functionality** - grab songs from a given genre/time-frame and create a playlist.

**2: Leaderboards** - display a user's top ten most and least played songs, playlists, in a given time-frame.

**3: Accounts** - Spotify user accounts auth with sharing/export for capsules and leaderboards.
- Sharing - share your leaderboards to others (png, link)

# Tech
**Hosting:** Azure

**Auth:** Spotify Auth 

**Server:** Expressjs

**Tech:** Reactjs, MongoDB, Spotify API

**Styling:** TailwindCSS? MaterialUI? AmplifyUI?


# Endpoints

/signin
POST: Sign in

/signout
POST: Sign out

/profile
GET: Retrieve profile data of given username in the query (?username=)

/createtimecapsule
POST: Use given time frame(?timeframe=)  to compile all songs user has added to any playlist during this time into one playlist in user’s Spotify library 

/createrandomplaylist
POST:  Use given genre (?genre=) to create a playlist that lives inside user’s Spotify library

/createlink
GET: Create shareable link for a given playlist or leaderboard snapshot

/leaderboards
GET: Returns user’s top stats for a given time period

# Database Schema (MongoDB)

#### User
- User ID
- Username
- Name
- Email
- DOB

#### Leaderboards
- Playlists
- Songs
- Dates

#### Session
- Session ID
- Current Users

#### Playlists
- Playlist ID
- Genre
- User ID
- Playlist Link

#### Song
- Song ID
- Artist Name
- Song Name
- Playlists (JSON Column with Playlist ID’s)
- Times Skipped
- Number of Listens
- Play History(JSON Column with Dates when it was played by a user)

