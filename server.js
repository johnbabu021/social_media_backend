const express=require('express')
const   cors=require('cors')
const bodyParser = require('body-parser')
const getPostsRoute=require('./routes/getPostsRoutes')
const getUsersRoute=require('./routes/getUserRoutes')
const   getAuthRoutes=require('./routes/auth')
const {run} = require('./db/db')
const errHandler=require('./middleware/errHandler')
// const { userSchema, postSchema } = require('./models/collectionSchema')
require('dotenv').config()
console.log(process.env.MNGD) // remove this after you've confirmed it working
const app=express()
run()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));
  
// userSchema() 
// postSchema()
app.use(express.json())

// app.use(express.static('uploads/'))

app.use(cors())
app.get('/api',(req,res)=>{
    res.statusCode=500
    throw new Error('BRKEN')
})
app.use('/api/posts',getPostsRoute)
app.use('/api/users',getUsersRoute)
app.use('/api/auth',getAuthRoutes)
app.use(errHandler)
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
  })
app.listen(8000,()=>{
    console.log('app listening to port 8000')
})