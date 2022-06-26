const express=require('express')
const { getUser } = require('../controllers/userControllers')
const { usersCollection } = require('../db/db')
const authMiddleware = require('../middleware/authmiddleware')
const router=express.Router()

router.route('/:id').get(authMiddleware,getUser)



module.exports=router

