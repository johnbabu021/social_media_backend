const { reject } = require("bcrypt/promises")
const { postsCollection, usersCollection } = require("../db/db")
const { findPostById } = require("../helpers/postsCollection")
const ObjectId = require('mongodb').ObjectId
const {findUserById}=require('../helpers/usersCollection')
const createController=async(req,res,next)=>{
    console.log(req.body.caption)
 const insertedDoc=  await postsCollection.insertOne({
       user:req.user._id, 
       caption:'',
       comments:[],
       likes:[],
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
}
const updateCaption=(req,res,next)=>{
// console.log(req.image._id)
return new Promise((resolve,reject)=>{
    const image=req.image
    console.log(image)
if(image._id){
    resolve(image._id)
}
else{
    reject('image id is not properly passed from the request')
}
})
.then(async(imageId)=>{


 await postsCollection.updateOne(
    {
        _id:imageId
    },
    {
        $set:{
            caption:req.body.caption
        }
    }
)
// console.log(updatePost)
const updatedData=await postsCollection.findOne({_id: imageId})

res.status(200).json(updatedData)
}).catch(err=>{
next(err)
})
}
const addComment=(req,res,next)=>{
    return new Promise(async(resolve,reject)=>{
        const {postId}=req.body
if(postId){
    resolve(postId)
}
else{
    reject('postId is a required field')
}

    }).then(async(postId)=>{
        const post=await findPostById(postId)

 await postsCollection.updateOne(
            {
                _id:post._id
            },
            {
                $push:{
                   comments: {
                        user:req.user._id,
                        comment:req.body.comment
                    }
            }
            }
        )
        // console.log(updatedPost)
        const updatedPost=await findPostById(postId)
        res.status(200).json(updatedPost)
    }).catch(err=>{
        next(err)
    })
}
const updateLike=(req,res,next)=>{
    const {postId}=req.body
    return new Promise((resolve,reject)=>{
        if(postId){
            resolve(postId)
        }
        else{
            reject('postId is a required field')
        }
    }).then(async(postId)=>{
        const post=await findPostById(postId)
        postsCollection.updateOne(
            {
                _id:post._id
            },
            {
                $push:{
                    likes:{
                       user:req.user._id 
                    }
                }
            }
        )
        const updatedPost=await findPostById(post._id)
res.status(200).json(updatedPost)
    }).catch(err=>{
        next(err)
    })
}

const getPostsWithUserId=async(req,res)=>{
    const {id}=req.params
    const user=await findUserById(id)
    res.status(200).json(user.posts)
}
const getSinglePostWithPostId=async(req,res,next)=>{
const {id}=req.params
const post=await findPostById(id)
res.status(200).json(post)
// next()

}



module.exports={createController,
    updateCaption,
    getPostsWithUserId,
    getSinglePostWithPostId,
addComment,
updateLike

}