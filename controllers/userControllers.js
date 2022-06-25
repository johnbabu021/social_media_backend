const { usersCollection } = require("../db/db")
var jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateToken");
//@desc sign up user
//@route /api/auth/register
//@access public
const signUpUser =
    async (req, res, next) => {
        const { username, password, email } = req.body
        console.log(username, password, email)
        // throw new Error('please enter all fields')
        if (username === undefined || email === undefined || password === undefined) {
            res.status(500)
            next('enter all fields')
        }
        const userExists = await usersCollection.findOne({ email })
        if (userExists) {
            res.status(400)
            try {
                throw new Error('user already exists')

            }
            catch (err) {
                next(err)
            }
            // next('user already exists')
            // next()
            // throw new Error('user already exists')
        }
        const userData = await bcrypt.hash(req.body.password, 10)
            .then(async (hash) => {
                const user = await usersCollection.insertOne({
                    username: username,
                    email: email,
                    password: hash,
                    posts:[]
                })
                return user
            })
        if (userData) {
            const userCreated = await usersCollection.findOne({
                _id: new ObjectId(userData.insertedId)
            })
            const resultedUser = {
                user: {
                    _id:userData.insertedId,
                    username: userCreated.username,
                    email: userCreated.email
                },
                token: await generateToken(userData.insertedId)
            }
            res.status(201).json(resultedUser)

        }
        else {
            res.status(400)
            throw new Error('Invalid user data')
        }

    }



//@desc login user
//@route /api/auth/login
//@access public

const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    if (typeof email === undefined && typeof password === undefined) {
        res.status(200)
        try {
            throw new Error('Email and password must be of type string')
        }
        catch (err) {
            next(err)
        }
    }

    const user = await usersCollection.findOne({ email })
    console.log(user)
    if (user) {
        const data = await bcrypt.compare(password, user.password).then((result) => {
            console.log(result)
            return result
        })
        if (data)
            res.status(200).json({
                _id:user._id,
                username: user.username,
                email: user.email,
                posts:user.posts,
                token: await generateToken(user._id)

            })
        else {
            res.status(401)
            try {
                throw new Error("Incorrect password")

            }
            catch (err) {
                next(err)
            }
        }
    }
}


module.exports = {
    signUpUser,
    loginUser
}