/* eslint-disable new-cap, camelcase*/
'use strict';

const express = require(`express`);
const router = express.Router();



/* GET home page. */
router.get(`/`, (req, res, next) => {
  if (!req.query.code) {
    res.redirect(`/login`);
  }
  const token = req.query.code;
  res.render(`index`, {
    title: `Home`,
  });
});

router.get(`/login`, (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?scope=${process.env.SCOPE}&client_id=${process.env.CLIENT_ID}`);
});

module.exports = router;
