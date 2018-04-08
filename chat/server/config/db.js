var mongoose = require('mongoose'),
    DB_URL = 'mongodb://47.93.34.145:27017/Chat';

// 连接
mongoose.connect(DB_URL);

// 测试连接是否成功
mongoose.connection.on('connected', function () {
    console.log('my mongodb connection success !!!')
})

// 连接异常的情况
mongoose.connection.on('error', function (er) {
    console.log('connection error: ' + er);
})

// 连接断开
mongoose.connection.on('disconnected', function () {
    console.log('mongogdb disconnection')
})


module.exports = mongoose;