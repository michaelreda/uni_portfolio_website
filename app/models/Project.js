var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    short_descrip:{
      type:String,
      required:true
    },
    descrip:String,
    category:{
      type:String,
      required:true
    },
    student:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    img:String,
    Screenshots:[String],
    repo:String,
    date: { type: Date, default: Date.now },
    rating:{type:Number, default:0},
    weighted_rating:{type:Number, default:0},
    fiveRating: [{type:mongoose.Schema.Types.ObjectId, ref: 'user',default:[]}],
    fourRating: [{type:mongoose.Schema.Types.ObjectId, ref: 'user',default:[]}],
    threeRating: [{type:mongoose.Schema.Types.ObjectId, ref: 'user',default:[]}],
    twoRating: [{type:mongoose.Schema.Types.ObjectId, ref: 'user',default:[]}],
    oneRating: [{type:mongoose.Schema.Types.ObjectId, ref: 'user',default:[]}],
    num_rating: {type:Number, default:0},
    URL:String
})

var Project = mongoose.model("project", projectSchema);

module.exports = Project;
