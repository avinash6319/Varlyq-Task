const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const postsController=require("../controllers/postsController")
const auth = require("../auth/auth")

// USER
 router.post('/register', userController.creatUserData)
router.get('/user/:userId',userController.getUserData)
router.put('/user/:userId',userController.updateProfile)
router.delete('/user/:userId', userController.deleteuser)
router.post('/login',userController.loginUser)


// posts
 router.post("/posts",auth.authenticate,postsController.createpost)
router.get("/posts/:postId",auth.authenticate,postsController.getpostData)
router.put("/posts/:postId",auth.authenticate,auth.authorisation,postsController.updatePosts)
router.delete('/posts/:postId',auth.authenticate,auth.authorisation,postsController.deletepost)


router.all('/*', (req, res) => {
    return res.status(400).send({ status: false, message: "Please provide correct path!" })
})


module.exports = router