const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName : {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    userName : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        min: 3
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    password : {
        type: String,
        required: true
    }
},{timestamps: true});

userSchema.virtual('fullname').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
    authenticate : async function(password){
        return password === this.password;
    }
};

module.exports = mongoose.model('User',userSchema);