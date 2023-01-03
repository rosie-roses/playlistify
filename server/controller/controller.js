const User = require("../model/User");
const mongoose = require("mongoose");
const db = mongoose.connection;
const userColl = db.collection("users");
const trackColl = db.collection("tracks");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Handle errors.
const handleErrors = (error) => {
  console.log(error.message, error.code);
  let errors = { email: "", username: "", password: "" };
  // Incorrect email.
  if (error.message === "Incorrect email.") {
    errors.email = "That email is not registered.";
  }
  // Incorrect password.
  if (error.message === "Incorrect password.") {
    errors.password = "That password is incorrect.";
  }
  // Duplicate error code.
  if (error.code === 11000) {
    errors.email = "That email is already registered.";
    return errors;
  }
  // Validation errors.
  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// For JWT Tokens.

const maxAge = 3 * 24 * 60 * 60; // 3 days.

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.index_get = (req, res) => {
  res.render("index");
};

module.exports.register_get = (req, res) => {
  res.render("register");
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.register_post = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.create({ email, username, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.profile_get = (req, res) => {
  res.render("profile");
};

module.exports.google_callback_get = async (req, res) => {
  /* Create cookie so that google authenticate user can pass the authMiddleware check 
    before going into protected page '/profile'. */
  const token = createToken(req.user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.redirect("/profile");
};

module.exports.addTrack_get = (req, res) => {
  res.render("addTrack");
};

module.exports.addTrack_post = async (req, res) => {
  let { track, artist, rating } = req.body;
  rating = parseInt(rating);

  const trackObj = await trackColl.findOne({
    track: { $regex: track, $options: "i" },
    artist: { $regex: artist, $options: "i" },
  });
  let alreadyRated = false;
  // Track being added already exists in the tracks collection.
  if (trackObj) {
    // Check if the current user trying to add the already has the track in their playlist.
    for (var i = 0; i < trackObj.ratedBy.length; i++) {
      if (trackObj.ratedBy[i].user.email === res.locals.user.email) {
        alreadyRated = true;
        break;
      }
    }
    if (alreadyRated) {
      // Current user has this track in their playlist.
      res.status(400).json({ error: "Track already exists in playlist!" });
    } else {
      // Current user doesn't have this track in their playlist.
      // So add current user to the ratedBy array in tracks collection
      trackColl.updateOne(
        {
          track: { $regex: track, $options: "i" },
          artist: { $regex: artist, $options: "i" },
        },
        {
          $push: {
            ratedBy: {
              user: {
                email: res.locals.user.email,
                username: res.locals.user.username,
              },
              starRating: rating,
            },
          },
        }
      );
      // And add the track to the playlist array in the users collection.
      userColl.findOneAndUpdate(
        { email: res.locals.user.email },
        {
          $push: {
            playlist: {
              track,
              artist,
              rating,
              imageUrl: "test-img",
            }, //inserted data is the object to be inserted
          },
        }
      );
      res.status(200).json({
        trackObj: {
          track,
          artist,
        },
      });
    }
  } 
  // Track being added doesn't exist in the tracks collection.
  else {
    // So add it to the tracks collection.
    trackColl.insertOne({
      track,
      artist,
      imageUrl: "test-img",
      ratedBy: [
        {
          user: {
            email: res.locals.user.email,
            username: res.locals.user.username,
          },
          starRating: rating,
        },
      ],
    });
    // And add it to the current user's playlist as well.
    userColl.findOneAndUpdate(
      { email: res.locals.user.email },
      {
        $push: {
          playlist: {
            track,
            artist,
            rating,
            imageUrl: "test-img",
          }, //inserted data is the object to be inserted
        },
      }
    );
    res.status(201).json({
      trackObj: {
        track,
        artist,
      },
    });
  }
};

function getTrackInfo(track, artist) {
  const options = {
    method: "POST",
    url: "https://musicapi13.p.rapidapi.com/search",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "3a738e7ef6msh0fe74ae3cdc082cp16caf2jsn69ace3468f25",
      "X-RapidAPI-Host": "musicapi13.p.rapidapi.com",
    },
    data: `{"track":"${track}","artist":"${artist}","type":"track","sources":["spotify"]}`,
  };
  axios
    .request(options)
    .then(function (response) {
      for (var key of Object.keys(response.data.tracks)) {
        if (key === "0") {
          const info = response.data.tracks[key];
          if ((info.data.status = "success")) {
            console.log(info.data.name);
            console.log(info.data.artistNames[0]);
            console.log(info.data.imageUrl);
          } else {
            console.log("Unsuccessful getting track from music API :(");
          }
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}
