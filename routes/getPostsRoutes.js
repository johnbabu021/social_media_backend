const express=require('express')
const { postsCollection } = require('../db/db')
const router=express.Router()

router.route('/').get(async(req,res)=>{
res.status(200).json(await    postsCollection.find({}).toArray()
)
})
router.route('/create').post((req,res)=>{
    postsCollection.insertOne({
       caption:"this is beautiful",
       comments:{
        user:'john',
        comment:"beauty"
       }
    })
})
module.exports=router