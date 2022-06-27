const express=require('express')
const { getUser, followUser, unFollowUser } = require('../controllers/userControllers')
const { usersCollection } = require('../db/db')
const authMiddleware = require('../middleware/authmiddleware')
const router=express.Router()

router.route('/:id').get(authMiddleware,getUser)
router.route('/follow')
.post(authMiddleware,followUser)
.delete(authMiddleware,unFollowUser)



module.exports=router

