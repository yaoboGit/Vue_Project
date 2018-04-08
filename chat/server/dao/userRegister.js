var User = require('../model/User.js')



function userRegister(user){
  this.userInfo = new User({
    userName: user.userName,
    password: user.password,
    age: user.age
  })
};

// 注册用户
userRegister.prototype.saveUser = function saveUser(callback) {

},

// 查找用户
userRegister.prototype.login = function saveUser(callback) {
  var wherrestr ={userName: this.userInfo.userName, password: this.userInfo.password}
  User.find(wherrestr, function (err, res) {
    if(err) {
      callback(true, '查询失败')
      console.log('err' + err);
    } else {
      callback(true, '查询成功', res)
      console.log('res:' + res)
    }
  })
}

module.exports = userRegister;