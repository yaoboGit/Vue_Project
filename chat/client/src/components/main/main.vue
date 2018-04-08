<template>
  <div class="flex-layout">
    <div class="nav">
      <span>
        <img :src="$store.state.imgBaseUrl + currentUser.imageUrl"/>
      </span>
    </div>
      <div class="chat">
        <div class="chat-left">
          <div class="chat-left-nav">
            <div class="chat_tab_div">
              <ul class="chat-tab-ul">
                <li :class="[leftNavName === 'person' ? 'chat-tab-select' : '']">
                  <span class="icon" :class="[leftNavName === 'person' ? 'icon-person-light' : 'icon-person']" @click="changeTab('person')"></span>
                </li>
                <li></li>
                <li :class="[leftNavName === 'message' ? 'chat-tab-select' : '']">
                  <span class="icon" :class="[leftNavName === 'message' ? 'icon-message-light' : 'icon-message']" @click="changeTab('message')"></span>
                </li>
              </ul>
            </div>
            <!-- 搜索栏 -->
            <div class="chat-search">
              <el-input placeholder="请输入内容" prefix-icon="" size="small" v-model="searchName">
                <i class="el-icon-search el-input__icon" slot="suffix" @click="doSearchPersonList">
                </i>
              </el-input>
            </div>
            <div>
              <!-- 人物列表 -->
              <ul class="person-ul">
                  <li v-for="(item, index) in listData" :class="{'person-ul-select' : item.flag }" :key="item._id" @click="getUser(item, index)">
                    <el-badge :value="item.tipNum"  :max="99" class="person-ul-img">
                      <img :src="$store.state.imgBaseUrl + item.imageUrl" alt="img"/>
                    </el-badge>
                    <div class="person-ul-info">
                      <span class="user-name">{{item.userName}}</span>
                      <span class="user-tip">{{item.tip}}</span>
                    </div>
                  </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="chat-right">
          <div class="chat-right-top">
            <span>{{chatUser.userName}}</span>
          </div>
          <div class="chat-right-content" id="chatContent">
            <ul class="chat-list-ul">
              <li class="im-chat-cli" v-for="item in showContentChild" :key="item.index" :class="item.flag === '1' ? 'im-chat-clir' : 'im-chat-clil'">
                <img v-if="item.flag === '1'" :src="$store.state.imgBaseUrl + item.imageUrl" alt="img"/>
                <img :src="$store.state.imgBaseUrl + item.imageUrl" v-else alt="img"/>
                <div>{{item.message}}</div>
              </li>
            </ul>
          </div>
          <div class="chat-right-bottom">
            <div class="chat-inputArea">
              <div class="inputArea"  ref="sendContent" @keyup.enter="sendMessage" contenteditable >
              </div>
            </div>
            <div class="send-button">
              <el-button type="primary" size="small" @click="sendMessage" round>发送（S）</el-button>
            </div>
          </div>

        </div>
      </div>
  </div>
</template>
<script>
import {getCookie} from '@/config/utils.js'
export default {
  data () {
    return {
      leftNavName: 'message',
      searchName: '',
      currentUser: { // 当前登陆用户
        _id: getCookie('_id'),
        userName: getCookie('userName'),
        imageUrl: getCookie('imageUrl'),
        email: getCookie('email')
      },
      chatUser: {}, // 聊天对象
      listData: [], // 好友列表
      chatContent: '',
      showContentParent: [],
      showContentChild: []
    }
  },
  mounted () {
    let _this = this;
    let userId = _this.$route.params.userId;
    _this.$socket.emit('connect', '');
    _this.doSearchPersonList(userId);
  },

  sockets: {
    connect: function () {
      this.id = this.$socket.id
    },
    receiveMessage: function (obj) {
      if (obj._id === this.currentUser._id) { // 为当前用户
        this.showContentParent.push({sendId: obj.sendId, receiverId: obj._id, message: obj.sendContent, flag: '0', imageUrl: obj.imageUrlxx})
        this.showContentChild = [];
        for (let item of this.showContentParent) {
          if (this.chatUser._id === item.sendId) { // 聊天对象发言
            this.showContentChild.push(item);
          }
          if (this.chatUser._id === item.receiverId) { // 当前人发言
            this.showContentChild.push(item);
          }
        }
        // 算出左边提示的内容
        for (let index in this.listData) {
          if (obj.sendId === this.listData[index]._id) {
            this.listData[index].tip = obj.sendContent;
            if (!this.listData[index].tipNum) {
              this.listData[index].tipNum = 0;
            }
            this.listData[index].tipNum += 1;
          }
        }

        setTimeout(function () {
          var div = document.getElementById('chatContent');
          div.scrollTop = div.scrollHeight;
        }, 100)
      }
    }
  },

  methods: {
    getUser (obj, index) {
      this.chatUser = obj;
      for (let index in this.listData) {
        this.listData[index].flag = false;
      }
      obj.flag = true;
      this.showContentChild = [];
      for (let item of this.showContentParent) {
        if (obj._id === item.sendId) {
          this.showContentChild.push(item);
        }
        // 为当前用户点击的时候
        if (obj._id === item.receiverId) {
          this.showContentChild.push(item);
        }
      }
      // 清空提醒
      this.listData[index].tipNum = 0;
    },

    changeTab (type) {
      this.leftNavName = type;
    },

    doSearchPersonList (userId) {
      let _this = this;
      this.axios.post('/userChat/findUser', {_id: userId}).then(function (response) {
        if (response) {
          _this.listData = response.data.data;
        }
      })
    },

    // 发送消息
    sendMessage () {
      if (!this.chatUser._id) {
        this.$message.info('请选择你要聊天的用户');
        return;
      }
      let sendContent = this.$refs.sendContent.innerText;
      if (sendContent.trim() === '') {
        return;
      }
      this.chatUser.sendContent = sendContent;
      this.chatUser.sendContent = sendContent;
      this.chatUser.sendId = this.currentUser._id;
      this.chatUser.imageUrlxx = this.currentUser.imageUrl;
      this.showContentParent.push({sendId: this.currentUser._id, receiverId: this.chatUser._id, message: sendContent, flag: '1', imageUrl: this.currentUser.imageUrl});
      this.showContentChild.push({sendId: this.currentUser._id, receiverId: this.chatUser._id, message: sendContent, flag: '1', imageUrl: this.currentUser.imageUrl})
      setTimeout(function () {
        var div = document.getElementById('chatContent');
        div.scrollTop = div.scrollHeight;
      }, 100)
      this.$socket.emit('sendMessage', this.chatUser);
      this.$refs.sendContent.innerText = '';
    }
  }
}
</script>

<style scoped>
  .chat {
    display: flex;
    height: 75%;
    width: 50%;
    border: 1px solid white;
    border-radius: 3px;
  }

  @media (max-width: 992px) {
    .chat {
      width: 700px;
    }
  }

 .chat-left {
    width: 25%;
    height: 100%;
    background: rgba(255,255,255,0.9);
  }

  .chat-left-nav {

  }

  .chat_tab_div {
    border-bottom: 1px solid #cccccc;;
  }

  .chat-tab-ul {
    height: 50px;
    margin: 0 10px;
  }

  .chat-tab-ul li {
    float: left;
    margin: 0 auto;
    height: 100%;
    width: 33%;
    text-align: center;
  }

  .chat-tab-ul li span {
    position: relative;
    top: 25%;
  }

  .chat-tab-select {
    border-bottom: 1px solid deepskyblue;
    transition: all 1s ease-out;
  }

  .chat-search {
    margin: 10px;
  }

  .person-ul {
    min-height: 150px;
  }

  .person-ul li{
    position: relative;
    height: 50px;
    padding: 5px 10px;
    border-bottom: 1px solid #ececec;
  }

  .person-ul li:hover{
    cursor: pointer;
    background: #e6e3e3;
  }

  .person-ul li img {
    height: 45px;
    with: 45px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }

  .person-ul-img {
    position: absolute;
    top: 10px;
  }

  .person-ul-info {
    display: inline-block;
    position: relative;
    top: 5px;
    margin-left: 60px;
  }
  .user-name {
    dispaly: block;
    font-size: 14px;
  }

  .user-tip {
    display: block;
    font-size: 12px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .person-ul-select {
    cursor: pointer;
    background: #e6e3e3;
  }

  .el-icon-search {
    cursor: pointer;
  }

  .person-ul li span {
    position: relative;
    top: 20%;
  }

  .chat-right {
    position: relative;
    width: 75%;
    background: rgba(255,255,255,1);
  }

  .chat-right-top {
    height: 50px;
    border-bottom: 1px solid #cccccc;
  }

  .chat-right-top span{
    position: relative;
    top: 10px;
    left: 10px;
  }

  .chat-right-content {
    height: calc(100% - 233px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .chat-list-ul li{
    width: 100%;
    padding: 10px 0;
  }

  .chat-right-bottom {
    position: absolute;
    bottom: 0;
    height: 180px;
    width: 100%;
    border-top: 1px solid #cccccc;
  }

  .chat-inputArea {
    width: 100%;
  }

  .inputArea {
    overflow-y: auto;
    padding: 10px 20px;
    height: 100px;
    outline: none;
  }

  .send-button {
    padding: 10px;
    text-align: right;
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

  .nav span img{
    display: inline-block;
    position: relative;
    right: 10px;
    top: 5px;
  }

  .nav span img {
    height: 45px;
    width: 45px;
    border-radius: 50%;
  }
</style>
