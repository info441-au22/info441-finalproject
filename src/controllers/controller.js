const db = require('../models');
const Playlist = db.playlists;

// Create and Save a new PlaylistId
exports.create = (req, res) => {
  if (!req.body.playlistId) {
    res.status(400).send({ message: 'PlaylistID can not be empty!' });
    return;
  }

  const playlist = new Playlist({
    playlistId: req.body.playlistId,
  });

  playlist
    .save(playlist)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', error: err });
    });
};

// Retrieve all PlaylistIds from the database.
exports.findAll = (req, res) => {
  Playlist.countDocuments({}, function (err, count) {
    if (err) {
      res.status(500).json({ status: 'error', error: err });
    } else {
      res.send({ count: count });
    }
  });
};
