const { postsCollection, usersCollection } = require("../db/db")
const ObjectId = require('mongodb').ObjectId
const {findUserById}=require('../helpers/usersCollection')
const createController=async(req,res,next)=>{
 const insertedDoc=  await postsCollection.insertOne({
       user:req.user._id, 
       caption:req.body.caption,
       comments:{},
       likes:{},
       shares:0,
       views:0
    })
    await usersCollection.updateOne(
       {
            _id:new ObjectId(req.user._id)
        },
     {  
            $push:{posts:{postId:insertedDoc.insertedId}}
        }
    )
    const insertedData=await postsCollection.findOne({_id: new ObjectId(insertedDoc.insertedId)})
  req.image=insertedData
  next()
    res.status(200).json(insertedData)
}
const getPostsWithUserId=async(req,res,next)=>{
    const {id}=req.params
    const user=await findUserById(id)
    res.status(200).json(user)
}
module.exports={createController,getPostsWithUserId}