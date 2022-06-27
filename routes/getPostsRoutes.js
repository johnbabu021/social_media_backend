const express=require('express')
const { ObjectId } = require('mongodb')
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/original/posts')
    },
    filename:async(req,file,cb)=>{
        // console.log(file)
        const fileType=file.originalname.substring(file.originalname.indexOf('.')+1)
        await postsCollection.updateOne({
            _id:req.image._id
        },
        {
               $set:{
            type:fileType
        }}
       )

        cb(null, req.image._id+'.'+fileType)
    }
})
const upload = multer({ storage: storage })
const { createController, getPostsWithUserId, getSinglePostWithPostId, updateCaption, addComment, addLike, deletePostController, deleteComment } = require('../controllers/postControllers')
const { postsCollection } = require('../db/db')
const authMiddleware = require('../middleware/authmiddleware')
const router=express.Router()


router.route('/').get(async(req,res)=>{
res.status(200).json(await    postsCollection.find({}).toArray()
)
})
//@desc create a post
//@route /api/posts/post
//@access private
//@auth bearer
//@body req.body.caption
//@body image file
router.route('/post')
.post(authMiddleware,
    createController,
    upload.single('image'),
    updateCaption)
.delete(authMiddleware,deletePostController)
//@desc get posts from a user
//@route /api/user/:id 
//@access private
router.route('/user/:id')
.get(authMiddleware,getPostsWithUserId)
//@desc get post from a document
//@route /api/post/:id 
//@acess private
router.route('/:id')
.get(authMiddleware,getSinglePostWithPostId)
//@desc add comment
//@api /api/posts/comment
//@method PATCH
//@access private
//@ body 
// postId:post id of the post to be updated
// comment comment to be added to the post
//res commentid of collection
router.route('/comment')
.patch(authMiddleware,addComment)

//@desc delete a comment
//@API /api/posts/comment
//@method DELETE
//@access private
//@body--commentId
.delete(authMiddleware,deleteComment)
//@desc add likes
//@api /api/posts/like
//@method PATCH
//@access private
//@body
// postId:post id of the post to be updated
router.route('/like')
.patch(authMiddleware,addLike)
//@desc update caption
//@API /api/posts/caption
//@method PATCH
//@access private   
//@body
//postId
//caption
router.route('/caption')
.patch(authMiddleware,updateCaption)
module.exports=router