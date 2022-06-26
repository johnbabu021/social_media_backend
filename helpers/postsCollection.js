const ObjectId = require('mongodb').ObjectId
const { postsCollection } = require("../db/db");
const findPostById=async(id)=>{
const post=await postsCollection.findOne({
    _id:new ObjectId(id)
})
return post
}
module.exports={
    findPostById
}