const express=require('express')
const { usersCollection } = require('../db/db');
const { signUpUser, loginUser } = require('../controllers/userControllers');

const router=express.Router()
router.route('/register').post(signUpUser)
router.route('/login').post(loginUser)

module.exports=router