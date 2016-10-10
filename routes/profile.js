/* eslint-disable new-cap */
'use strict';

const express = require(`express`);
const router = express.Router();

/* GET profile page. */
router.get(`/`, (req, res, next) => {
  res.send(`respond with a resource`);
});

module.exports = router;
