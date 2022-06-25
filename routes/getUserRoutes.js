const express=require('express')
const router=express.Router()

router.route('/').get(async(req,res)=>{
res.status(200).json(await    usersCollection.find().toArray()
)

})


module.exports=router

