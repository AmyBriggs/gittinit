/* eslint-disable camelcase */
'use strict';

if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

// const favicon = require(`serve-favicon`);
const express = require(`express`);
const path = require(`path`);
const logger = require(`morgan`);
const cookieParser = require(`cookie-parser`);
const bodyParser = require(`body-parser`);

const routes = require(`./routes/index`);
const users = require(`./routes/users`);

const app = express();
// const GitHubApi = require(`github`);

// view engine setup
app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `hbs`);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, `public`, `favicon.ico`)));
app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, `public`)));



// const github = new GitHubApi({
//   debug: true,
//   protocol: `https`,
//   host: `api.github.com`,
//   header: {
//     'user-agent': `gittinit`,
//   },
//   followRedirects: false,
//   timeout: 5000,
// });
//
// github.authenticate({
//   type: `oauth`,
//   key: process.env.CLIENT_ID,
//   secret: process.env.CLIENT_SECRET,
// });
//
// github.authorization.create({
//   scopes: [`user`, `public_repo`, `repo`, `repo:status`, `gist`],
//   note: `access needed to show your peer repos`,
//   note_url: `https://gittinit.herokuapp.com`,
  // headers: {
  //   'X-GitHub-OTP': `two-factor-code`,
  // },
// }, (err, res) => {
//   if (err) {
//     console.error(err);
//   }
//   if (res.token) {
//     console.log(res.token);
//   }
// });

app.use(`/`, routes);
app.use(`/users`, users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(`Not Found`);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get(`env`) === `development`) {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render(`error`, {
      error: err,
      message: err.message,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render(`error`, {
    error: {},
    message: err.message,
  });
});


module.exports = app;
