import React, { useEffect } from "react";

const CLIENT_ID = "1afe16f7b5c44f1ab21bc53d0af990fb";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000/";
const SCOPES = [
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
];
const SPACE_DELIMITER = "%20";
const SCOPES_COMBINED = SCOPES.join(SPACE_DELIMITER);
/*
http://localhost:3000/#access_token=BQCx5S41-5GIFZlNNLZ1Q7l4bKcuiRo6ZOhvQZZ70zq2-khn-FA4wi9TX2bWUffWd853MWVUTAIoMRHjvBh4wxnzNwSDTEgz9e1imQnBn7SLzsuDruGZUMEqaiRrRhTHGPieCF854dRGYfg2vfxLJj49LNv2EiU8kFgIXsxACOsCfZJKJDfs2PUYVg-yg5MvZpEdGPrj_VaaP1FeiXOXzEIUGHNCkARsf8vBXbaezWjTrg&token_type=Bearer&expires_in=3600
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});
  return paramsSplitUp;
};

function Header() {
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("expiresIn", expires_in);
      localStorage.setItem("tokenType", token_type);
    }
  });
  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_COMBINED}&response_type=token&show_dialog=true`;
  };
  return (
    <button onClick={handleLogin}>
      <i className="fab fa-spotify" /> Login with Spotify
    </button>
  );
}

export default Header;
