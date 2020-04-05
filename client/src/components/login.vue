<template>
  <div class="flex-layout">
    <div class="nav">
      <span v-show="status === 'register'" @click="changeCurrentStatus('login')">登陆</span>
      <span v-show="status === 'login'" @click="changeCurrentStatus('register')">注册</span>
    </div>
    <!-- 登陆 -->
    <div class="login" v-show="status === 'login'">
      <el-form :model="loginFromData" status-icon ref="loginFromData" label-width="100px" class="flex-ruleForm">
        <el-form-item prop="email">
          <el-input type="text" placeholder="邮箱" v-model="loginFromData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密 码" v-model="loginFromData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" style="width: 100%" @click="submitForm('loginFromData')">登&nbsp;&nbsp;&nbsp;&nbsp;陆</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 注册 -->
    <div class="register" v-show="status === 'register'">
      <el-form :model="registerFromData" :rules="registerFromRules" status-icon ref="registerFromData" label-width="100px" class="flex-ruleForm">
        <el-form-item>
          <!--<div class="flex-img text-center" >-->
            <!--<img src="./../assets/img/photo-default.png"/>-->
          <!--</div>-->
          <div class="avatar-uploader">
            <div class="el-upload">
              <div class="avatar" @click="getPicClick">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="avatar-uploader-icon el-icon-plus"></i>
              </div>
              <input name="fileUpload" id="upload" type="file" style="display: none"/>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="email">
          <el-input type="text" placeholder="邮箱" v-model="registerFromData.email" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input type="text" placeholder="用户名" v-model="registerFromData.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密 码" v-model="registerFromData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input type="password" placeholder="确认密码" v-model="registerFromData.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" style="width: 48%" @click="submitForm('registerFromData')">确 定</el-button>
          <el-button style="width: 48%" @click="resetForm('registerFromData')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {setCookie} from '@/config/utils.js'
export default {
  data () {
    let checkEmail = (rule, value, callback) => {
      if (value) {
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*[.]\w+([-.]\w+)*$/
        if (reg.test(value)) {
          return callback();
        } else {
          return callback(new Error('请输入这个正确的邮箱格式'))
        }
      }
      callback();
    };

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerFromData.checkPassword !== '') {
          this.$refs.registerFromData.validateField('checkPassword');
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerFromData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      status: 'register',
      loginFromData: {
        email: '',
        password: ''
      },
      registerFromData: {
        email: '',
        imageUrl: '',
        userName: '',
        password: '',
        checkPassword: ''
      },
      registerFromRules: {
        email: [
          {required: true, validator: checkEmail, trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ]
      },
      imageUrl: ''
    };
  },
  mounted () {
    let _this = this;
    document.getElementById('upload').onchange = function (e) {
      let file = e.target.files[0];
      var formData = new FormData();
      formData.append('fileUpload', file);
      _this.axios.post('/user/file-upload', formData).then(function (response) {
        if (response.data.state === 200) {
          _this.imageUrl = _this.$store.state.imgBaseUrl + response.data.result;
          _this.registerFromData.imageUrl = response.data.result;
        }
      });
    }
  },
  methods: {
    // 获取点击事件
    getPicClick () {
      var ie = navigator.appName === 'Microsoft Internet Explorer' ? 1 : 0;
      if (ie === 1) {
        document.getElementById('upload').click();
      } else {
        var a = document.createEvent('MouseEvents'); // FF的处理
        a.initEvent('click', true, true);
        document.getElementById('upload').dispatchEvent(a);
      }
    },

    changeCurrentStatus (flag) {
      this.status = flag;
    },

    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },

    // 登陆 注册
    submitForm (formName) {
      let _this = this;
      if (formName === 'loginFromData') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/user/login', this.loginFromData).then(function (response) {
              if (response) {
                if (response.data.data.length > 0) {
                  let data = response.data.data[0];
                  _this.$socket.emit('login', data);
                  setCookie('_id', data._id);
                  setCookie('userName', data.userName);
                  setCookie('imageUrl', data.imageUrl);
                  setCookie('email', data.email);
                  _this.$router.push({name: 'chatMain', params: {userId: data._id}})
                } else {
                  _this.$message.error('用户名密码错误');
                }
              }
            })
          }
        });
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/user/register', this.registerFromData).then(function (response) {
              if (response) {
                if (response.data.data) {
                  _this.$message.success('注册成功');
                  _this.resetForm('registerFromData');
                  _this.status = 'login';
                } else {
                  _this.$message.error(response.data.msg);
                }
              }
            })
          }
        });
      }
    },

    resetForm (formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
  .flex-ruleForm {
    width: 600px;
  }

  .register {
  }

  .nav {
    position: fixed;
    top: 0;
    width: 100%;
    height: 55px;
    line-height: 55px;
    background: rgba(0,0,0, 0.5);
    text-align: right;
  }

  .nav span{
    position: relative;
    right: 10px;
    color: white;
    font-size: 16px;
    letter-spacing: 2px;
  }

  .nav span:hover {
    color: deepskyblue;
    cursor: pointer;
  }
</style>
