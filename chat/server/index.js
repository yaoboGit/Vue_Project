var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const path = require('path');        // 这是node的路径处理模块，可以格式化路径
const io = require('socket.io')(server);     //将socket的监听加到app设置的模块里。
var userLogin = require('./router/userLogin')
var userChat = require('./router/userChat')

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/user', userLogin);
app.use('/userChat', userChat)

app.use(express.static(path.join(__dirname, 'views')))

app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
// will print stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send(err.message)
})

server.listen(3000,()=>{                // ()=>是箭头函数，ES6语法，如果不习惯可以使用 function() 来代替 ()=>
  console.log("server running at 127.0.0.1:3000");       // 代表监听3000端口，然后执行回调函数在控制台输出。
});

const users = [];                    //用来保存所有的用户信息
let usersNum = 0;
/*socket*/
io.on('connection',(socket)=> {              //监听客户端的连接事件
  /**
   * 所有有关socket事件的逻辑都在这里写
   */
  usersNum++;
  console.log(`当前有${usersNum}个用户连接上服务器了`);
  socket.on('login', (data) => {
    //将该用户的信息存进数组中
    users.push({
      _id: data._id,
      userName: data.userName,
      sendContent: []
    });
  });

  /**
   * 监听sendMessage,我们得到客户端传过来的data里的message，并存起来。
   * 我使用了ES6的for-of循环，和ES5 的for-in类似。
   * for-in是得到每一个key，for-of 是得到每一个value
   */
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
    for (let _user of users) {
      if (_user._id === data._id) {
        _user.sendContent.push(data.sendContent);
        //信息存储之后触发receiveMessage将信息发给所有浏览器
        break;
      }
    }
  });
});

module.exports = app;