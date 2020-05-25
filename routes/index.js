const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const pjson = require('../package.json');

router.get('/info', function(req, res, next) {
  res.status(200).json({apiVersion: pjson.version});
});

module.exports = router;
