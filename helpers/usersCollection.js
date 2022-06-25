const { usersCollection } = require("../db/db");
const ObjectId = require('mongodb').ObjectId
const findUserById=async(id)=>{
  const user=  await usersCollection.findOne({_id:new ObjectId(id)})
//   console.log(user)  
  return user
}
module.exports={
    findUserById
}