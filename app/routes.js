// require dependincies
var express = require('express');


var router = express.Router();
var session = require('express-session');

var multer= require('multer');//used for images
var upload=multer({dest:'public/profilePics'});


var projectController = require('./controllers/projectController');
var userController = require('./controllers/userController');
var portfolioController = require('./controllers/portfolioController');

// add routes
//router.get('/', projectController.getAllProjects);
router.get('/',portfolioController.home_page_routing);
router.get('/pages/:page',portfolioController.getTenPortfolios);
router.post('/search', projectController.searchProjects);
router.get('/view_project/:projectId', projectController.viewProject);

router.get('/register_page',userController.loadRegisterPage);
router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);
router.get('/forgot_password/:email',userController.forgotPassword);
router.get('/logout',userController.logoutUser);
router.get('/create_portfolio_page', portfolioController.loadCreatePortfolio);
router.post('/create_portfolio/:student_id',upload.any(), portfolioController.create_portfolio);
router.get('/view_portfolio/:student_id', portfolioController.view_portfolio);

router.get('/add_work_page',projectController.addWorkPage)
router.post('/add_project',upload.any(), projectController.createProject);
router.post('/update_project_title',projectController.update_project_title);
router.post('/update_project_descrip',projectController.update_project_descrip);
router.post('/update_project_link',projectController.update_project_link);
router.post('/update_project_repo',projectController.update_project_repo);
router.get('/delete_project/:projectId',projectController.delete_project);

router.post('/rate',projectController.rateProject);
// export router

module.exports = router;
