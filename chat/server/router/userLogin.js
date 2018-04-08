var express = require('express');
var router = express.Router();
var crypto = require('crypto'); // 引入加密算算法
var User = require('../model/User.js')
var multer = require('multer');
var fs = require('fs');

const UPLOAD_PATH = './public/temp'

var upload = multer({ dest: UPLOAD_PATH })

// 图片上传
//单个文件上传
router.post('/file-upload', upload.single('fileUpload'), function (req, res, next) {
  let target_path = req.file.path;
  let dest_path = './public/personImage/';
  // 创建唯一名字
  let name = new Date().getTime();
  fs.rename(target_path, dest_path + name + '.jpg', function (err, result) {
    if (err) {
      res.send({state: 500, msg: '上传失败'})
    } else {
      res.send({state: 200, msg: '上传成功', result: '\/personImage\/' + name + '.jpg'})
    }
  })
})

/* 注册 */
router.post('/register', function (req, res) {
    var userName = req.body['userName'];
    var password = req.body['password'];
    var email = req.body['email'];
    var imageUrl = req.body['imageUrl'];
    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    var newUser = new User({
        userName: userName,
        email: email,
        password: password,
        imageUrl: imageUrl
    })
    newUser.save(function (err, result) {
      if(err) {
        if (err.code === '11000') {
          res.send({state: 500, msg: '用户名重复',})
        } else {
          res.send({state: 500, msg: '注册失败',})
        }

      } else {
        res.send({state: 200, data: result,})
      }
    })
})

/* 登陆 */
router.post('/login', function (req, res) {
  var email = req.body['email'];
  var password = req.body['password'];
  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');
  User.find({email: email, password: password}, function (err, result) {
    if (result) {
      res.send({state: 200, msg: '登陆成功', data: result})
    } else {
      res.send({state: 500, msg: err})
    }

  })
})

module.exports = router;