const mongoose = require('mongoose');

module.exports = mongoose => {
  const NewPlaylistSchema = mongoose.model(
    "PlaylistIDs",
    mongoose.Schema(
      {
        playlistId: String,
      },
    )
  );

  return NewPlaylistSchema;
};