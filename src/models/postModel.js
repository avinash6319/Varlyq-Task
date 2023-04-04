const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
  createdBy: {type:ObjectId,required:true,ref:"User"},
  createdAt: {type: Date,default: Date.now,required: true},
  updatedAt: {type: Date,default: Date.now,required: true},
  message: {type: String,required: true},
  comments: {type:ObjectId,required:true,ref:"User"},
  sentAt: {type: Date,default: Date.now,required: true},
  liked: {type:ObjectId,required:true,ref:"User"} ,
  isDeleted: {type: Boolean,default: false}
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;