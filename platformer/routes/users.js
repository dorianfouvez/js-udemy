var express = require("express");
var router = express.Router();
var User = require("../models/User.js");

/* GET user list*/
router.get("/", function (req, res, next) {
  console.log("GET users/", User.list);
  User.getAllHighScores();
  if (!req.session.isAuthenticated) return res.status(401).send("bad email/password");
  return res.json(User.list);
});

/* POST user data for authentication */
router.post("/login", function (req, res, next) {
  let user = new User(req.body.email, req.body.email, req.body.password);
  console.log("POST users/login:", User.list);
  if (!user.checkCredentials(req.body.email, req.body.password))
    return res.status(401).send("bad email/password");
  
  // manage session data
  req.session.isAuthenticated = true;
  req.session.user = req.body.email;
  return res.json({ username: req.body.email });
});

/* POST a new user */
router.post("/", function (req, res, next) {
  console.log("POST users/", User.list);
  console.log("email:", req.body.email);
  if (User.isUser(req.body.email)) return res.status(409).end();
  let newUser = new User(req.body.email, req.body.email, req.body.password);
  newUser.save();
  // manage session data
  req.session.isAuthenticated = true;
  req.session.user = req.body.email;
  return res.json({ username: req.body.email });
});

/* GET logout */
router.get("/logout", function (req, res, next) {
  console.log("GET users/logout");
  if (req.session.isAuthenticated) {
    req.session.destroy(function (err) {
      // cannot access session here
      if (err) console.error("Error in session destroy:", err);
    });    
  }
  return res.status(200).end();
});

/* GET user object from username */
router.get("/:username", function (req, res, next) {
  console.log("GET users/:username", req.params.username);
  const userFound = User.getUserFromList(req.params.username);
  if (userFound) {
    return res.json(userFound);
  } else {
    return res.status(404).send("ressource not found");
  }
});

module.exports = router;
