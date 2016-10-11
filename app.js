/* eslint-disable camelcase */
'use strict';

if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

// const favicon = require(`serve-favicon`);
const express = require(`express`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const bodyParser = require(`body-parser`);
const logger = require(`morgan`);
const passport = require(`passport`);
const session = require(`express-session`);
const GitHubStrategy = require(`passport-github2`).Strategy;
const db = require(`./db/api`);
const https = require(`https`);
const g32ers = [
  { username: `Alisuehobbs` },
  { username: `ambaldwin21` },
  { username: `AmyBriggs` },
  { username: `BAMason` },
  { username: `colechambers` },
  { username: `courtneysanders418` },
  { username: `craigquincy` },
  { username: `David-H-152402` },
  { username: `Dillie-Z` },
  { username: `FreemanJamesH` },
  { username: `gordonhgraham` },
  { username: `kelseychapman` },
  { username: `ksztengel` },
  { username: `limawebdev1` },
  { username: `mariajcb` },
  { username: `MatieuB` },
  { username: `mattlg24` },
  { username: `MrCooper42` },
  { username: `mworks4905` },
  { username: `ScottyVG` },
  { username: `elanalynn` },
];

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
  callbackURL: `http://localhost:3000/auth/github/callback`,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    const updateDB = new Promise((resolve, reject) => {
      db.getUser(profile.username).then((user) => {
        if (user) {
          db.editUser(profile.username, accessToken)
          .then((result) => resolve(result))
          .catch((err) => reject(err));
        }
        else {
          db.createUser(profile.username, accessToken)
          .then((result) => resolve(result))
          .catch((e) => reject(e));
        }
      })
      .catch((error) => reject(error));
    });

    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    updateDB.then(() => { return done(null, profile); })
    .catch((rejected) => console.error(rejected));
  });
}
));

const app = express();

// configure Express
app.set(`views`, `${__dirname}/views`);
app.set(`view engine`, `hbs`);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, `public`, `favicon.ico`)));
app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(express.static(path.join(__dirname, `public`)));
app.use(passport.initialize());
app.use(passport.session());

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect(`/login`);
};

app.get(`/`, (req, res) => {
  res.render(`splash`);
});

app.get(`/index`, (req, res) => {
  res.render(`index`, { g32ers, user: req.user });
});

app.get(`/splash`, (req, res) => {
  res.render(`splash`, { user: req.user });
});

app.get(`/profile/:username`, ensureAuthenticated, (req, res) => {
  const request = require(`request`);

  let username = req.params.username;
  const options = {
    headers: {
      "User-Agent": `gittinit`,
    },
    url: `https://api.github.com/users/${username}`,
  };

  request(options, (err, resp, body) => {
    if (err) { console.error(err); }
    username = JSON.parse(body);
    res.render(`profile`, { user: username });
  });
});

app.get(`/profile`, ensureAuthenticated, (req, res) => {
  res.render(`profile`, { user: req.body });
});

app.get(`/edit`, ensureAuthenticated, (req, res) => {
  res.render(`edit`, { user: req.user });
});

app.post(`/edit`, (req, res, next) => {
  const profileData = JSON.stringify(req.body);

  db.getUser(req.user.username)
  .then((user) => {
    const options = {
      headers: {
        Authorization: `token ${user.token}`,
        "User-Agent": `gittinit`,
      },
      hostname: `api.github.com`,
      method: `POST`,
      path: `/user`,
    };
    const request = https.request(options, (response) => {
      let str = ``;
      response.on(`error`, (err) => console.error(err));
      response.on(`data`, (data) => str += data);
      response.on(`end`, () => {
        console.log(`done`, str);
        req.session.passport.user._json.name = JSON.parse(str).name;
        req.session.passport.user._json.company = JSON.parse(str).company;
        req.session.passport.user._json.location = JSON.parse(str).location;
        res.end();
      });
    });
    request.write(profileData);
    request.end();
  })
  .catch((err) => next(err));
});

app.get(`/login`, (req, res) => {
  res.render(`index`, { user: req.user });
});

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get(`/auth/github`, passport.authenticate(`github`, {
  scope: process.env.SCOPE,
}), (req, res) => { /* req will redirect to GH for auth, this is unused */ });

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(`/auth/github/callback`,
  passport.authenticate(`github`, { failureRedirect: `/login` }),
  (req, res) => {
    res.render(`index`, { g32ers, user: req.user });
  });

app.get(`/logout`, (req, res, next) => {
  db.deleteUser(req.user.username)
    .then()
    .catch((error) => next(error));
  req.logout();
  res.redirect(`/`);
});

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
