const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Post = require('../models/post');


// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });
      Post.find({'author': user._id}, function (err, posts) {
        if (err)
            res.json(err)
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            posts: posts
          },
          posts: posts

        });
            })

      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Post.find({'author': req.user._id}, function (err, posts) {
      res.json({user: req.user, posts})
  })

});

router.get('/:user_id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  User.findById(req.params.user_id, function (err, user, posts){
    if (err)
        res.send(err)
    Post.find({'author': user}, function (err, posts){
      if (err)
          res.send(err)
      res.json({user: user, posts: posts})
    })
  });


});

module.exports = router;
