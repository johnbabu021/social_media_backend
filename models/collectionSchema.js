const {db}=require('../db/db')

const userSchema=()=>{
    db.createCollection('users',{
    validator:{
        $jsonSchema:{
            bsonType:"object",
            required:["name"],
            properties:{
                name:{
                    bsonType:"string",
                    description:"name must be string"
                },
                password:{
                    bsonType:"string",
                    description:"password must be string"
                }
            }
        }
    }
})
}
const postSchema=()=>{
   db.createCollection("users",{
validator:{
    $jsonSchema:{
        bsonType:"object",
        required:[],
        properties:{
            caption:{
                bsonType:"string",
                description:"title must be string"
            },
            comments:{
                bsonType:"object",
                required:['user','comment'],
                properties:{
                    user:{
                        bsonType:"string",
                        description:"user must be string"
                    },
                    comment:{
                        bsonType:"string",
                        description:"comment must be string"
                    }
                } 
            }
            
        }
    }
}
})
}
module.exports={
userSchema,
postSchema
}