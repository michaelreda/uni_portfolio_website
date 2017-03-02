var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  id:{
    type:String
  },
  faculty:{
    type:String
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },

  profileIMG:{
    type:String
  },
  hasPortfolio:Number

})

var User = mongoose.model("user", userSchema);

module.exports = User;
