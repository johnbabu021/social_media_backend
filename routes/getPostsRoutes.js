const express=require('express')
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/original/posts')
    },
    filename:(req,file,cb)=>{
        // console.log(file)
        const fileType=file.originalname.substring(file.originalname.indexOf('.')+1)

        cb(null, req.image._id+'.'+fileType)
    }
})
const upload = multer({ storage: storage })
const { createController, getPostsWithUserId } = require('../controllers/postControllers')
const { postsCollection } = require('../db/db')
const authMiddleware = require('../middleware/authmiddleware')
const router=express.Router()


router.route('/').get(async(req,res)=>{
res.status(200).json(await    postsCollection.find({}).toArray()
)
})
//@desc create a post
//@route /api/posts/create
//@access private
//@auth bearer
//@body req.body.caption
//@body image file
router.route('/create').post(authMiddleware,createController,upload.single('image'))
router.route('/user/:id').get(getPostsWithUserId)
module.exports=router