const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    introduction: {
        type: String,
        default: '',
    },
    profileImage: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);