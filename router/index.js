const express = require('express');
const router = express.Router();
const login = require('../controllers/login.js');
const signup = require('../controllers/signup.js');
const wrapasync = require('../utils/wrapAsync.js');
const { userDetails } = require('../controllers/userDetails.js');
const authtoken = require('../middleware/authtoken.js');
const createProject = require('../controllers/createProject.js');
const fetchProjects = require('../controllers/fetchProjects.js');
const projectinfo = require('../controllers/projectinfo.js');
const fetchusers = require('../controllers/fetchusers.js');
const addColab = require('../controllers/addColab.js');
const aiResult = require('../controllers/aiResult.js');
const saveProject = require('../controllers/saveProject.js');
const deleteProject = require('../controllers/deleteProject.js');
const logout = require('../controllers/logout.js');
const enhancePrompt = require('../controllers/enhancePrompt.js');
const exportProject = require('../controllers/Download/exportProject.js')

router
    .route('/login')
    .post(wrapasync(login));    

router
    .route('/signup')
    .post(wrapasync(signup)); 
    
router
   .route('/userdetails')
   .get(authtoken,wrapasync(userDetails))   
   
router
   .route('/createproject')
   .post(authtoken, wrapasync(createProject))   

router
   .route('/fetchProjects')
   .post(authtoken, wrapasync(fetchProjects))

router
   .route('/projectInfo')
   .post(authtoken, wrapasync(projectinfo)) 
   
router
   .route('/fetchUsers')  
   .get(authtoken, wrapasync(fetchusers))
   
router
   .route('/addCollab')
   .post(authtoken, wrapasync(addColab)) 
   
router
   .route('/airesult')
   .get(aiResult)
   
router
   .route('/saveProjects')
   .post(wrapasync(saveProject))  
   
router
   .route('/deleteProject')
   .post(authtoken,wrapasync(deleteProject))  
   
router
   .route('/logout')
   .post(authtoken, wrapasync(logout))  
   
router
   .route('/enhance')
   .post(authtoken, wrapasync(enhancePrompt))   

router
   .route('/export')
   .post(authtoken, wrapasync(exportProject))   
   
module.exports = router;

//1. Import the express module and express.router
//2. create various router
//3. export the router