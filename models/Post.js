const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    // 지역
	siDo: {
        type: String,
        required: true,
    },

    // 제목
    title: {
        type: String,
    },

	// 사진 (일단은 하나만 넣게끔)
	img: {
		type: String,
	},
	
    // 내용
    content: {
        type: String,
        required: true,
    },

    // 유저
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // 댓글 
    comments: [{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }],

    // 댓글 수
    commentCount: {
        type: Number,
        default: 0,
    },

    // 좋아요
    likes: [{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],

    // 좋아요 수
    likeCount: {
        type: Number,
        default: 0,
    },
    
}, { 
	timestamps: true,
});

module.exports = mongoose.model('Post', PostSchema);