const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    Interviewername:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    startTime:{
        type: String,
        required: true,
    },
    endTime:{
        type: String,
        required: true,
    },
    Resume:{
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required:true,
        default: Date.now,
    },
});

module.exports= mongoose.model('User', userSchema);