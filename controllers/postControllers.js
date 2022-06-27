// const { reject } = require("bcrypt/promises")
const { postsCollection, usersCollection, commentCollection } = require("../db/db")
const { findPostById } = require("../helpers/postsCollection")
const ObjectId = require('mongodb').ObjectId
const { findUserById } = require('../helpers/usersCollection')
// var path = require('path')
const {unlink}=require('node:fs/promises')
// const { resolve } = require("path")
const deletePostController = async (req, res) => {
    console.log(req.user)
    const toBeDeleted=await findPostById(req.body.postId)
    const deletedPost = await postsCollection.deleteOne({
        _id: new ObjectId(req.body.postId),
        user:req.user._id
    })


    // return new Promise(async(resolve,reject)=>{
     try{
            await  unlink(`./uploads/original/posts/${req.body.postId}.${toBeDeleted.type}`,err=>{
                res.status(400).json(err)

            })
            res.status(204).json(deletedPost)

        }
     
    // })
catch(err){
    res.status(400).json(err)

}

    // console.log(deletedPost)

}
const createController = async (req, res, next) => {
    console.log(req.body.caption)
    const insertedDoc = await postsCollection.insertOne({
        user: req.user._id,
        caption: '',
        comments: [],
        likes: [],
        shares: 0,
        views: 0,
        type:''
    })
    await usersCollection.updateOne(
        {
            _id: new ObjectId(req.user._id)
        },
        {
            $push: { posts: { postId: insertedDoc.insertedId } }
        }
    )
    const insertedData = await postsCollection.findOne({ _id: new ObjectId(insertedDoc.insertedId) })
    req.image = insertedData
    next()
}
// const updateImageType=(req,res,next)=>{

// }
const updateCaption =async (req, res, next) => {
    console.log(req.body.caption,"caption")
    // console.log(req.image._id)
    // console.log('heeele')
    if(req.body.postId){
        req.image={_id:new ObjectId(req.body.postId)}
    }
    const post=await findPostById(req.body.postId)
    // console.log(post,"post")
    // console.log("image",req.image)
    // console.log(req.user._id,post.user)
    // console.log(req.user._id===post.user)
    // console.log(req.image._id)
    return new Promise((resolve, reject) => {
        const image = req.image

        if (image._id) {
            //@alert user is not checked here
            //@desc  altering person identity
            //@sol below code should work
            // req.user._id===post.user&&
            resolve(image._id)
        }
        else {
            reject('image id is not properly passed from the request')
        }
    })
        .then(async (imageId) => {


            await postsCollection.updateOne(
                {
                    _id: imageId
                },
                {
                    $set: {
                        caption: req.body.caption
                    }
                }
            )
            // console.log(updatePost)
            const updatedData = await postsCollection.findOne({ _id: imageId })

            res.status(200).json(updatedData)
        }).catch(err => {
            next(err)
        })
}
const addComment = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        const { postId } = req.body
        if (postId) {
            resolve(postId)
        }
        else {
            reject('postId is a required field')
        }

    }).then(async (postId) => {
        const comment = await commentCollection.insertOne({
            post: postId,
            user: req.user._id,
            comment: req.body.comment
        })
        const post = await findPostById(postId)

        await postsCollection.updateOne(
            {
                _id: post._id
            },
            {
                $push: {
                    comments: {
                        commnetId: comment.insertedId,
                    }
                }
            }
        )
        // console.log(updatedPost)
        const updatedPost = await findPostById(postId)
        res.status(200).json(updatedPost)
    }).catch(err => {
        next(err)
    })
}
const addLike = (req, res, next) => {
    const { postId } = req.body
    return new Promise((resolve, reject) => {
        if (postId) {
            resolve(postId)
        }
        else {
            reject('postId is a required field')
        }
    }).then(async (postId) => {
        const post = await findPostById(postId)
        postsCollection.updateOne(
            {
                _id: post._id
            },
            {
                $push: {
                    likes: {
                        user: req.user._id
                    }
                }
            }
        )
        const updatedPost = await findPostById(post._id)
        res.status(200).json(updatedPost)
    }).catch(err => {
        next(err)
    })
}

const getPostsWithUserId = async (req, res) => {
    const { id } = req.params
    const user = await findUserById(id)
    res.status(200).json(user.posts)
}
const getSinglePostWithPostId = async (req, res, next) => {
    const { id } = req.params
    const post = await findPostById(id)
    res.status(200).json(post)
    // next()

}



module.exports = {
    createController,
    updateCaption,
    getPostsWithUserId,
    getSinglePostWithPostId,
    addComment,
    addLike,
    deletePostController

}