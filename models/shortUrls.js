const mongoose = require('mongoose');
const shortId = require('shortid');



const shortUrlSchema = new mongoose.Schema({
    full:{
        type: String,
        required : true
    },
    short:{
        type: String,
        required : true,
        default : shortId.generate,
        unique: true
    },
    clicks:{
        type: Number,
        required : true,
        default : 0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('ShortUrl',shortUrlSchema);
