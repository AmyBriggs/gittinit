/* eslint-disable camelcase, max-len */
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
const moment = require(`moment`);
let g32ers;
db.getClass().then((result) => {
  g32ers = result;
});

// Passport session setup.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
passport.use(new GitHubStrategy({
    callbackURL: `https://gittinit.herokuapp.com/auth/github/callback`,
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
            } else {
              db.createUser(profile.username, accessToken)
                .then((result) => resolve(result))
                .catch((e) => reject(e));
            }
          })
          .catch((error) => reject(error));
      });

      updateDB.then(() => {
          return done(null, profile);
        })
        .catch((rejected) => console.error(rejected));
    });
  }
));

const app = express();

// configure Express
app.set(`views`, `${__dirname}/views`);
app.set(`view engine`, `hbs`);

// app.use(favicon(path.join(__dirname, `public`, `favicon.ico`)));
app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
}));

// Initialize Passport!
app.use(express.static(path.join(__dirname, `public`)));
app.use(passport.initialize());
app.use(passport.session());

// Simple route middleware to ensure user is authenticated.
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/splash`);
};

app.get(`/`, (req, res) => {
  res.render(`splash`);
});

app.get(`/index`, ensureAuthenticated, (req, res) => {
  res.render(`index`, {
    g32ers,
    user: req.user,
  });
});

app.get(`/splash`, (req, res) => {
  res.render(`splash`, {
    user: req.user,
  });
});

app.get(`/profile/:username`, ensureAuthenticated, (req, res, next) => {
  const request = require(`request`);
  const user = req.user.username;
  const repos = [];
  let token;
  let username = req.params.username;

  db.getUser(user)
    .then((result) => {
      token = result.token;
      const options = {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": `gittinit`,
        },
        url: `https://api.github.com/users/${username}`,
      };

      request(options, (err, resp, body) => {
        if (err) {
          console.error(err);
        }
        username = JSON.parse(body);
      });
    })
    .then(() => {
      const options = {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": `gittinit`,
        },
        url: `https://api.github.com/users/${username}/repos`,
      };

      request(options, (err, resp, body) => {
        if (err) {
          console.error(err);
        }
        const temp = JSON.parse(body);
        temp.sort((a, b) => (b.pushed_at < a.pushed_at) ? -1 : ((b.pushed_at > a.pushed_at) ? 1 : 0));
        temp.forEach((repo) => {
          repos.push({
            created_at: moment(repo.created_at).format(`M/DD/Y kk:mm:ss`),
            html_url: repo.html_url,
            name: repo.name,
            pushed_at: moment(repo.pushed_at).format(`M/DD/Y k:mm:ss`),
          });
        });
        res.render(`profile`, {
          repos,
          user: username,
        });
      });
    })
    .catch((err) => next(err));
});

app.get(`/profile`, ensureAuthenticated, (req, res) => {
  res.render(`profile`, {
    user: req.body,
  });
});

app.get(`/edit`, ensureAuthenticated, (req, res) => {
  res.render(`edit`, {
    user: req.user,
  });
});

app.post(`/edit`, ensureAuthenticated, (req, res, next) => {
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
        response.on(`data`, (data) => {
          str += data;
        });
        response.on(`end`, () => {
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

app.get(`/login`, ensureAuthenticated, (req, res) => {
  res.render(`index`, {
    user: req.user,
  });
});

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get(`/auth/github`, passport.authenticate(`github`, {
  scope: process.env.SCOPE,
}), () => { /* req will redirect to GH for auth, this is unused */ });

//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(`/auth/github/callback`,
  passport.authenticate(`github`, {
    failureRedirect: `/login`,
  }),
  (req, res) => {
    res.render(`index`, {
      g32ers,
      user: req.user,
    });
  }
);

app.get(`/logout`, ensureAuthenticated, (req, res, next) => {
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
