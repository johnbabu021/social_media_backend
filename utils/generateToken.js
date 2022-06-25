const jwt=require('jsonwebtoken')
const generateToken=async(data)=>{
 const token= await  jwt.sign(data.toJSON(),'shhh')
 return token
}
module.exports={
    generateToken
}