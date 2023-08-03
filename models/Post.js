const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({

	region: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
	// 일단은 하나만
	img: {
		type: String,
	},	
    content: {
        type: String,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    comments: [{
        type:Schema.Types.ObjectId,
        ref:'Comment',
    }],
    commentCount: {
        type: Number,
        default: 0,
    },

    likeCount: {
        type: Number,
        default: 0,
    },

}, { 
	timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);