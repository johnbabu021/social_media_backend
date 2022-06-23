const express=require('express')
const { usersCollection } = require('../db/db')
const router=express.Router()

router.route('/').get(async(req,res)=>{
res.status(200).json(await    usersCollection.find().toArray()
)

})

router.route('/register').post((req,res)=>{
    usersCollection.insertOne({
        name:"data",
        email:"jee@gmail.com",
        password:"asdfasd   "
    })
})

module.exports=router