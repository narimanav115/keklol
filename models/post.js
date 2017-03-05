const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');



var PostSchema = new Schema({
    post: {
        type: String,
        required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {type: Date, default: Date.now},
    likes: {type: Number, default: 0}

});



module.exports = mongoose.model('Post', PostSchema);
 
