const { MongoClient } = require("mongodb");
const { userSchema, postSchema } = require("../models/collectionSchema");
require('dotenv').config()
console.log(process.env.MNGD)
const client = new MongoClient(process.env.MNGD);
const db=client.db('social_media')
const postsCollection=db.collection("posts")
const usersCollection=db.collection('users')
const commentCollection=db.collection('comments')
async function run() {
    try {
      // Connect the client to the server
      await client.connect();
// console.log(      db.runCommand( { listColections: 1 } )  
// )
      // Establish and verify connection
      console.log("Connected successfully to server");
    } catch(err) {
      console.log(err)
      // Ensures that the client will close when you finish/error
      await client.close();
      console.log('hell clsed')
    }
  }
  
  module.exports={
    run,
    db,
    postsCollection,
    usersCollection,
    commentCollection
}