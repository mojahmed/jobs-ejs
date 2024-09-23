const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please Provide a name '],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name cannot be more than 50 characters long']
    },
    email:{
        type:String,
        required:[true, 'Please Provide an email '],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please Provide valid email',],
        unique: true,
    },
    password:{
        type:String,
        required:[true, 'Please Provide password '],
        minlength: [6, 'Password must be at least 6 characters long']
       
    },
})

 UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password,salt)

 })

 UserSchema.methods.createJWT = function() {
    return jwt.sign({userId:this._id,name:this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })
 }

 UserSchema.methods.comparePassword = async function (canditatePassword) { 
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
    
 }

module.exports =mongoose.model('User', UserSchema)