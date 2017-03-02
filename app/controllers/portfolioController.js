let Portfolio = require('../models/Portfolio');
let User = require('../models/User');
let Project = require('../models/Project');
var ObjectId = require('mongoose').Types.ObjectId;

let portfolioController = {
  home_page_routing:function(req,res){
    Portfolio.count(function(err,count){
      req.session.portfolio_num= count;
      res.redirect('/pages/1');
   })

  },

  getTenPortfolios:function(req,res){
    req.session.page = req.params.page;

    req.session.range = module.exports.pagination(req.session.page,Math.floor(parseInt(req.session.portfolio_num)/10)+1);
    //console.log(req.session.range);
    Portfolio.find()
    .skip(10 * (req.params.page - 1))
    .limit(10)
    .populate('student')
    .populate({path: 'projects', options: { sort: { 'weighted_rating': -1 ,'date':1} } })
    //.slice('projects', 2)
    .exec(function(err,portfolios){
          if(err)
            res.send(err);
            else{
              if(portfolios.length==0){
                req.flash('error','No portfolios are available');
              }
               for(var i=0;i<portfolios.length;i++){
                 portfolios[i].works_num=portfolios[i].projects.length;
                 portfolios[i].projects=portfolios[i].projects.slice(0,2);
               }
              res.render('index', {portfolios,session:req.session});
        }
        })
  },
  pagination:function(c, m) {
    //console.log(m);
    var current = c,
        last = m,
        delta = 1,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
},

view_portfolio:function(req, res){

  Portfolio.findOne({student:new ObjectId(req.params.student_id)}).populate('student').populate('projects').exec(function(err, portfolio){
    if(err)
    res.send(err.message);
    else{
      if(portfolio){
        res.render('view_portfolio', {projects:portfolio.projects,session:req.session,student:portfolio.student});
      }else{
        req.flash('error',"You don't have a portfolio yet, create your portfolio now..");
        res.render('create_portfolio',{session:req.session});
      }
    }

  })
},

loadCreatePortfolio:function(req,res){
    res.render('create_portfolio',{session:req.session});
},
create_portfolio:function(req,res){
    console.log(req.body);
    let project = new Project(req.body);
    project.student=new ObjectId(req.params.student_id);
    project.URL= req.body.link;
    project.repo= req.body.repo;
    var profileFileName="";
      switch(project.category){
        case "Codes":project.img="img/d_Codes.png";
        profileFileName=req.files[0]?req.files[0].filename:'default';
        break;
        case "Screenshots":project.img="img/d_Screenshots.png"
        var filenames=[];

        for(var i=0;i<req.files.length;i++){
          console.log(req.files[i].fieldname);
          if(req.files[i].fieldname=="Screenshots")
              filenames.push(req.files[i].filename);
          else
              profileFileName=req.files[i].filename;
        }
        project.Screenshots=filenames;
        ;break;
        case "Links":project.img="img/d_Links.png";
        profileFileName=req.files[0]?req.files[0].filename:'default';
        break;
      }
      console.log(profileFileName);
    project.save(function(err,project){
      let portfolio= new Portfolio(req.body);
      portfolio.student=new ObjectId(req.params.student_id);
      portfolio.projects.push(new ObjectId(project._id));
      portfolio.save(function(err,portfolio){
        if(err){
          req.flash('error',"an error has occurred please try again");
          res.redirect('/create_portfolio_page');
        }
        else{
            User.update({ _id: req.params.student_id }, { $set: {
               firstName: req.body.firstName ,
               lastName: req.body.lastName ,
               id: req.body.id1+"-"+req.body.id2,
               faculty: req.body.faculty,
               hasPortfolio: 1,
               profileIMG:profileFileName!=""?profileFileName:'default'
             }}).exec(function(err,user){
               if(err){
                     console.log(err);
                     req.flash('error',"an error has occurred please try again");
                     res.redirect('/create_portfolio_page');
                   }else{
                     req.session.user=user;
                     req.flash('success',"Your portfolio was successfully created");
                     res.redirect('/view_portfolio/'+req.params.student_id);
                   }
             })

            // User.findById({id:req.params.student_id},function(student){
            //   User.find({id:student._id}).remove().exec();
            //   let newStudent = new User(req.body);
            //   newStudent.profileIMG=req.files[0].filename?req.files[0].filename:'';
            //   newStudent.id=req.body.id1+"-"+req.body.id2;
            //   newStudent.email=req.session.user.email;
            //   newStudent.password=req.session.user.password;
            //   newStudent.save(function(err){
            //     if(err){
            //       console.log(err);
            //       req.flash('error',"an error has occurred please try again");
            //       res.redirect('/create_portfolio_page');
            //     }else{
            //       req.flash('success',"Your portfolio was successfully created");
            //       res.redirect('/view_portfolio/'+req.params.student_id);
            //     }
            //   })
            // })

        }
      });
    });


}


}

module.exports = portfolioController;
