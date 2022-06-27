const { commentCollection } = require("../db/db");
// const findCommentById=(req,res)
const ObjectId = require('mongodb').ObjectId
const findCommentById=async(id)=>{
 return  await commentCollection.findOne({
    _id:new ObjectId(id)

})
}
module.exports={findCommentById}