module.exports = (app) => {
  const playlists = require('../controllers/controller.js');

  var router = require('express').Router();

  // Save created PlaylistID to DB
  router.post('/', playlists.create);
  router.get('/playlistIds', playlists.findAll);

  app.use('/api/playlists', router);
};
