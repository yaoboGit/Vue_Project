var express = require('express');
var router = express.Router();
var User = require('../model/User.js')


router.post('/findUser', function (req, res) {
  var _id = req.body['_id'];
  User.find({_id:{$ne: _id}}, function (err, result) {
    if (err) {
      res.send({state: 500, msg: '查询失败', data: result})
    } else {
      res.send({state: 200, msg: '查询成功', data: result})
    }
  })
})


module.exports = router;
