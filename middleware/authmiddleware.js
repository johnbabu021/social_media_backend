const jwt=require('jsonwebtoken')
const { findUserById } = require('../helpers/usersCollection')

const authMiddleware=async(req,res,next)=>{
    const auth=req.headers.authorization
if(auth){
 if(auth.startsWith('Bearer'))
{

const token=auth.substring(auth.indexOf(' ')+1)
const decoded=jwt.verify(token,'shhh')
console.log(decoded)
req.user=await  findUserById(decoded)
new Promise((resolve,reject)=>{
    if(decoded){
        resolve(true)
    }
    else{
        console.log('reje')
        reject('Error in signature')
    }
})
.then(()=>{
    next()
})
.catch((err)=>{
    res.status(400)
try{
    throw new Error("token verification missing")
}
catch(err){
    next(err)
}
})
}
else{
    res.status(400)
    try{
        throw new Error('Bearer token not found')

    }
    catch(err){
        next(err)
    }
}
}
else{
    res.status(400)
    try{
        throw new Error('Missing authentication')
    }
    catch(err){
        next(err)
    }
}
}
module.exports=authMiddleware