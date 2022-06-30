const express=require('express')
const   cors=require('cors')
const bodyParser = require('body-parser')
const getPostsRoute=require('./routes/getPostsRoutes')
const getUsersRoute=require('./routes/getUserRoutes')
const   getAuthRoutes=require('./routes/auth')
const {run} = require('./db/db')
const {errHandler, notFound}=require('./middleware/errHandler')
// const { userSchema, postSchema } = require('./models/collectionSchema')
require('dotenv').config()
console.log(process.env.MNGD) // remove this after you've confirmed it working
const app=express()
run()

// app.use(bodyParser.json())
  // app.use(bodyParser.urlencoded({
  //     extended: true
  //   }));
  app.use(bodyParser.urlencoded())
// userSchema() 
// postSchema()
app.use(express.json())

app.use(express.static('uploads/'))



app.use(cors())
// app.use((req,res))

app.post('/api',(req,res)=>{
  res.send(JSON.stringify(req.body))
      // throw new Error('BRKEN')
})
app.use('/api/posts',getPostsRoute)
app.use('/api/users',getUsersRoute)
app.use('/api/auth',getAuthRoutes)
app.use(errHandler)
app.use(notFound)
app.listen(process.env.PORT || 8000,()=>{
  console.log(process.env.PORT)
})
