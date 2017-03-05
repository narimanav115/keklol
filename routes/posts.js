const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Post = require('../models/post');
const mongoose = require('mongoose');

// create post by user

router.post('/create-post', passport.authenticate('jwt', {session:false}), function (req, res, next)  {
  var post = new Post();
  var postId = post._id;
  post.post = req.body.post;
  post.author = req.user._id;
  post.save(function (err, post) {
    if (err)
        res.send(err);
    res.json({msg: 'Post ID ' + post._id});

  });


    // res.json({success: 'Post created ID:' + post._id, postedBy: post.author});
});

// get post by id

router.get('/:post_id', function (req, res) {
    Post.findById(req.params.post_id, function (err, post) {
        if (err)
            res.send(err);
        res.json(post);
    });
});

// put post by id


router.put('/:post_id', passport.authenticate('jwt', {session:false}), function (req, res) {
    Post.findById(req.params.post_id, function (err, post) {
        if (req.user.username !== post.author){
            res.status(404).send({success: false, msg: 'Ti ne aftor'});
        } else
            post.save(function (err){
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({message: "Post updated! Blyat"});
                }
        post.post = req.body.post;
        });
    });
});

// delete post

router.delete('/:post_id', passport.authenticate('jwt', {session:false}), function (req, res) {
  Post.findById(req.params.post_id, function (err, post) {
      if (req.user.username !== post.author){
          res.status(404).send({success: false, msg: 'Ti ne aftor'});
      } else
        post.remove(function (err) {
            if (err){
                res.send(err);
            }
            else {
                res.json({message: 'Success! Ur post deleted'});
            }
        });
      });
});

module.exports = router;
