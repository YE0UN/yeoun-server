const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    content: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },

    // 대댓글 기능은 차후에
    /*parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    reComments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }],*/

}, { 
	timestamps: true,
});

module.exports = mongoose.model('Comment', CommentSchema);