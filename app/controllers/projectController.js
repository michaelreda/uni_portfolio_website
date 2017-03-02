let Project = require('../models/Project');
let Portfolio = require('../models/Portfolio');
var ObjectId = require('mongoose').Types.ObjectId;


let projectController = {

  getAllProjects:function(req, res){

    Project.find(function(err, projects){

      if(err)
      res.send(err.message);
      else
      console.log(projects);
      res.render('index', {projects,msg:req.session.msg,user:req.session.user});
    })
  },

  searchProjects:function(req, res){

    Project.find({title:{$regex : ".*"+req.body.input+".*",$options : 'i' }},function(err, projects){

      if(err)
      res.send(err.message);
      else
      res.send(projects);
    })
  },


  addWorkPage:function(req,res){
    res.render('create_project',{session:req.session});
  },

  createProject:function(req, res){
    let project = new Project(req.body);
    var filenames=[];
    for(var i=0;i<req.files.length;i++){
      filenames.push(req.files[i].filename);
    }
    project.Screenshots=filenames;
    project.student= new ObjectId(req.session.user._id);
    if(project.img== undefined){
      switch(project.category){
        case "Codes":project.img="img/d_Codes.png";break;
        case "Screenshots":project.img="img/d_Screenshots.png";break;
        case "Links":project.img="img/d_Links.png";break;
      }
    }
    project.save(function(err, project){
      if(err){
        res.send(err.message)
        console.log(err);
      }
      else{
        Portfolio.update({student:new ObjectId(req.session.user._id)},
        {$push :{'projects':project}}
      ).exec(function(err){
        if(err)
        console.log(err);
        else
        res.redirect('/view_portfolio/'+req.session.user._id);
      })

    }
  })
},

viewProject:function(req, res){

  Project.findById(req.params.projectId).populate('student').exec(function(err, project){
    //console.log(project);
    if(err)
    res.send(err.message);
    else{
      //Project.find({student._id:project.student._id,_id: { $ne: req.params.projectId }}).sort({date:-1}).limit(3).exec(function(err,recentProjects){
      var ObjectId = require('mongoose').Types.ObjectId;
      Project.find({student:new ObjectId(project.student._id),_id: { $ne: req.params.projectId }}).sort({date:-1}).limit(3).exec(function(err,recentProjects){
        if(err)
        res.send(err.message);
        else {
          Project.count({student:new ObjectId(project.student._id)}).exec(function(err,count){
            project.student.noOfProjects=count;
            project.rated_before=0;
            if(req.session.user){
              let user_id=ObjectId(req.session.user._id);
              console.log(user_id);
              function findcb(arr) {
                console.log(arr);
                for(var i=0;i<arr.length;i++){
                  if(arr[i].toString()==user_id.toString()){
                    console.log('accepted: '+arr[i]+" "+user_id);
                    return 1;
                  }
                }
                return 0;
              }
              if(findcb(project.oneRating)||
              findcb(project.twoRating)||
              findcb(project.threeRating)||
              findcb(project.fourRating)||
              findcb(project.fiveRating))
              project.rated_before=1;
            }
            console.log(project.rated_before);
            res.render('view_project', {project,session:req.session,recentProjects:recentProjects});
          });

        }
      })

    }
  })
},

update_project_title:function(req,res){
    //console.log(req.body);
    Project.update({_id:req.body.projectId},{$set:{title:req.body.title}}).exec(function(err){
      if(err)
        res.send(err);
      else
        res.redirect('/view_project/'+req.body.projectId);
    })
},

update_project_descrip:function(req,res){
    //console.log(req.body);
    Project.update({_id:req.body.projectId},{$set:{descrip:req.body.descrip,short_descrip:req.body.short_descrip}}).exec(function(err){
      if(err)
        res.send(err);
      else
        res.redirect('/view_project/'+req.body.projectId);
    })
},

update_project_link:function(req,res){
    //console.log(req.body);
    Project.update({_id:req.body.projectId},{$set:{URL:req.body.link}}).exec(function(err){
      if(err)
        res.send(err);
      else
        res.redirect('/view_project/'+req.body.projectId);
    })
},

update_project_repo:function(req,res){
    //console.log(req.body);
    Project.update({_id:req.body.projectId},{$set:{repo:req.body.repo}}).exec(function(err){
      if(err)
        res.send(err);
      else
        res.redirect('/view_project/'+req.body.projectId);
    })
},

delete_project:function(req,res){
  Project.findOne({_id:req.params.projectId}).remove().exec(function(){
    res.redirect('/view_portfolio/'+req.session.user._id);
  })
},

rateProject:function(req,res){


  //to calculate the new average after then nnth number, you multiply the old average by n−1n−1, add the new number, and divide the total by nn.
  var num_rating= parseFloat(req.body.num_rating)+1;
  var newRating= ((num_rating-1)*parseFloat(req.body.old_rating)+parseFloat(req.body.inputRating))/num_rating;
  //console.log(parseInt(req.body.inputRating)/5);
  console.log('newRating: '+newRating);


  var R = newRating;//average for the movie (mean) = (Rating)
  var v = num_rating;//number of votes for the movie = (votes)
  var m = 1//minimum votes required to be listed in the Top 250

  Project.find({},'rating',function(err,projects){
    var C = 0;//the mean vote across the whole report
    for(var i=0;i<projects.length;i++){
      C+=projects[i].rating;
    }
    C=C/projects.length;

    //the mean vote across the whole report (currently 6.9)

    //var weighted_rating  = (v / (v+m)) * R + (1 / (v+m)) * C;
    var weighted_rating= (R/5)*v;
    // console.log(R);
    // console.log(v);
    // console.log(m);
    // console.log(C);
    console.log("weighted_rating: "+weighted_rating);

    switch(req.body.inputRating){
      case '1':

      Project.update({_id:req.body.projectId},{$set:{rating:newRating,num_rating:num_rating,weighted_rating:weighted_rating},$push:{
        oneRating:req.session.user._id
      }},function(err,project){
        res.redirect('/view_project/'+req.body.projectId);
      })

      ;break;
      case '2':

      Project.update({_id:req.body.projectId},{$set:{rating:newRating,num_rating:num_rating,weighted_rating:weighted_rating},$push:{
        twoRating:req.session.user._id
      }},function(err,project){
        res.redirect('/view_project/'+req.body.projectId);
      })

      ;break;
      case '3':

      Project.update({_id:req.body.projectId},{$set:{rating:newRating,num_rating:num_rating,weighted_rating:weighted_rating},$push:{
        threeRating:req.session.user._id
      }},function(err,project){
        res.redirect('/view_project/'+req.body.projectId);
      })

      ;break;
      case '4':

      Project.update({_id:req.body.projectId},{$set:{rating:newRating,num_rating:num_rating,weighted_rating:weighted_rating},$push:{
        fourRating:req.session.user._id
      }},function(err,project){
        res.redirect('/view_project/'+req.body.projectId);
      })

      ;break;
      case '5':

      Project.update({_id:req.body.projectId},{$set:{rating:newRating,num_rating:num_rating,weighted_rating:weighted_rating},$push:{
        fiveRating:req.session.user._id
      }},function(err,project){
        res.redirect('/view_project/'+req.body.projectId);
      })

      ;break;
    }
  })


}
}

module.exports = projectController;
