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
    },
    profileImage: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = User = mongoose.model("user", UserSchema);