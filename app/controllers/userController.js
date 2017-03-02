let User = require('../models/User');
let Project = require('../models/Project');
let Portfolio = require('../models/Portfolio');
var passwordHash = require('password-hash');



let userController = {

  loadRegisterPage:function(req, res){


    res.render('register', {session:req.session});

  },

  registerUser:function(req,res){
    let user = new User(req.body);
    //user.id=req.body.id1+"-"+req.body.id2;
    console.log(req.body.emailR);
    user.password = passwordHash.generate(req.body.password);
    user.hasPortfolio=0;
    user.profileIMG="default";
    //user.profileIMG = req.files[0].filename?req.files[0].filename:'';
    user.save(function(err, user){
      if(err){
        console.log(err);

        var error=err.toString().includes("email")&&err.toString().includes("duplicate")?"email is already used, if you forgot your password, check forgot your password command":err;
        req.flash('error',error);
        res.send('/register_page');
      }
      else{
        console.log(user);
        req.flash('success',"registered succesfully");
        res.send('/');
        //res.render('index',{msg});
      }
    })


  },

  loginUser:function(req,res){
    //res.send(passwordHash.generate(req.body.password));
    User.findOne({
      email:req.body.email
    },function(err, user){
      if(err)
      res.send(err.message);
      else
      if(!user){
        req.session.msg = "Email not found";
        res.redirect('/');
        req.session.msg=null;
      }
      else {
        //res.send(req.body.password+"  "+user.password);
        if(passwordHash.verify(req.body.password,user.password)){
          req.session.user=user;
          console.log(req.session.user);
          req.session.cookie.expires= false;
          Portfolio.findOne({student:user}).exec(function(portfolio){
            if(portfolio)
            req.session.user.hasPortfolio=1;
            else
            req.session.user.hasPortfolio=0;
          })
          req.flash('success','logged in successfully');
          res.redirect('/view_portfolio/'+user._id);
        }else{
          req.session.msg = "Email or password used are wrong please try again.";
          res.redirect('/');
          req.session.msg=null;
        }
      }
    })
  },

  logoutUser:function(req,res){
    req.session.destroy(function(){
      res.redirect('/');
    });

  },

  forgotPassword:function(req,res){

    if(req.params.email=="email="){
      req.flash('error',"Please enter your email to send for you your password..");
      res.redirect('/');
    }else{
      var email = req.params.email.split("=");
      User.findOne({email:email[1]},function(err,user){
        if(!user){
          req.flash('error',"There is no registered user with this email, please retype your email or register a new account..");
          res.redirect('/');
        }else{



          var randomstring = require("randomstring");
          randomPass=randomstring.generate(12);
          hashedPass=passwordHash.generate(randomPass);
          User.update({email:email[1]},{$set:{password:hashedPass}},function(err,user){
            if(!user){
              req.flash('error',"There is no registered user with this email, please retype your email or register a new account..");
              res.redirect('/');
            }else{

              var nodemailer = require('nodemailer');
              var smtpTransport = require('nodemailer-smtp-transport');
              var transporter = nodemailer.createTransport(smtpTransport({
                service: 'Hotmail',
                auth: {
                  user: 'guc-portfolio@outlook.com', // Your email id
                  pass: 'gucportfolio2017' // Your password
                }
              }));
              var text = 'Hello '+user.firstName + ' your password is: \n\n' + randomPass;
              var mailOptions = {
                from: 'guc-portfolio@outlook.com', // sender address
                to: email[1], // list of receivers
                subject: 'Your Password', // Subject line
                //text: text //, // plaintext body
                html: '<b>Hello  ✔</b>'+'your password is :\n\n'+randomPass // You can choose to send an HTML body instead
              };
              transporter.sendMail(mailOptions, function(error, info){
                if(error){
                  console.log(error);
                  res.send(error);
                }else{
                  console.log('Message sent: ' + info.response);
                  req.flash('success',"An email is sent for you with a new random password..");
                  res.redirect('/');
                };
              });
            }
          })

        }

      })

    }
  },

  // view_portfolio:function(req, res){
  //
  //   Project.find({student:req.params.student_id},function(err, projects){
  //
  //     if(err)
  //     res.send(err.message);
  //     else{
  //       User.findById(req.params.student_id,function(err,student){
  //         res.render('view_portfolio', {projects,msg:req.session.msg,user:req.session.user,student:student});
  //       })
  //
  //     }
  //
  //   })
  // },

  home_page_routing:function(req,res){
    res.redirect('/1');
  },

  getTenPortfolios:function(req,res){
    req.session.page = req.params.page;
    User.find().skip(10 * (req.params.page - 1)).limit(10).exec(function(err,portfolios){
      //console.log(portfolios);
      var ObjectId = require('mongoose').Types.ObjectId;
      Project.find({ student: { $in: portfolios}}).sort({rating:-1}).limit(2).exec(function(err,projects){
        //console.log(projects);
        for(var j=0;j<portfolios.length;j++){
          portfolios[j].projects= new Array();
          for(var i=0;i<projects.length;i++){
            if( portfolios[j]._id==projects[i].student.toString()){
              portfolios[j].projects.push(projects[i]);
            }
          }

        }
        //  console.log(portfolios[5].projects);
        res.render('index', {portfolios,session:req.session});

      })

      //console.log(portfolios[4].projects);

    })
  }

}

module.exports = userController;
