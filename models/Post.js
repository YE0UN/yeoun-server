const mongoose = require('mongoose');
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
    author: {
        type:Schema.Types.ObjectId,
        ref:'User',
        //required: true,
    },
}, { 
	// 생성, 수정시간 자동으로 기록
	timestamps: true 
});

module.exports = mongoose.model('Post', PostSchema);