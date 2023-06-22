const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

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

    // 생성시간
    createdAt: {
        type: String,
        default: function() {
            return moment.tz(new Date(), 'Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
        }
    },
    // 수정시간
    updatedAt: {
        type: String,
        default: function() {
            return moment.tz(new Date(), 'Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
       }
    }
});

module.exports = mongoose.model('Post', PostSchema);