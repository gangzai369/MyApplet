// 引入数据库函数
import {
  get,
  add
} from '../../utils/db'
import {
  toCloud,
} from '../../utils/tools'
// pages/pbrecipe/pbrecipe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    imgList: [], //保存临时图片地址
    imgUrl: [], //保存图片地址提交到数据库
    userObj: {} //保存用户信息
  },
  //接收临时图片
  saveImg(e) {
    // files中必须是url:地址，对象类型
    let imgList = e.detail.tempFilePaths.map(item => {
      return {
        url: item
      }
    })
    this.setData({
      imgList,
      imgUrl: e.detail.tempFilePaths
    })
  },
  // 加载type数据库数据
  async onLoad() {
    await get('type')
      .then(res => {
        this.setData({
          typeList: res.data
        })
      })
  },

  // 提交数据
  async toSubmit(e) {
    // 先把图片上传到云端
    let tempPath = this.data.imgUrl
    wx.showLoading({
      title: '正在发布',
    })
    // 上传多张图片
    let arr = []; //保存存储到云端的图片地址
    for (let i = 0; i < tempPath.length; i++) {
      await toCloud(tempPath[i])
        .then(res => {
          arr.push(res.fileID)
        })
        .catch(err => {
          // console.log(err);
          return;
        })
    }

    //接收到用户信息
    await wx.getSetting({
      success: res => {
        // 如果用户已经授权，获取用户信息
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 提交内容处理
              let images = arr; //数组图片转为字符串
              let nowtime = new Date().getTime(); //获取当前时间时间戳
              let formObj = e.detail.value;
              this.setData({
                userObj: res.userInfo
              });
              // 调用函数
              this.submitUser(formObj, nowtime, images);
            }
          })
        }
      }
    });
  },
  // 提交数据封装成函数
  async submitUser(formObj, nowtime, images) {
    await add('menu', {
      typeid: formObj.typeid, //类型id
      name: formObj.name, //菜谱名
      images, //图片
      intro: formObj.info, //菜单详情
      nickName: this.data.userObj.nickName, //用户名
      avatarUrl: this.data.userObj.avatarUrl, //用户头像
      view: 0, //访问量
      likes: 0, //收藏数
      addTime: nowtime //当前时间戳
    }).then(res => {
      let tid = res._id
      // 调用跳转函数,传递id
      this.toIndex(tid)
      wx.showToast({
        title: '发布成功!',
      })
    }).catch(err => {
      console.log(err);
      return;
    })
  },
  // 跳转到主页
  toIndex(tid) {
    wx.reLaunch({
      url: '/pages/index/index?id=' + tid,
    })
  }
})