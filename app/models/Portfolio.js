var mongoose = require('mongoose');

var portfolioSchema = mongoose.Schema({
  student:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  projects:[{type: mongoose.Schema.Types.ObjectId, ref: 'project'}]

})

var Portfolio = mongoose.model("portfolio", portfolioSchema);

module.exports = Portfolio;
