import {
  get,
  getOne,
  remove,
  removeCloud
} from '../../utils/db'
import {
  getStar
} from '../../utils/tools'
const db = wx.cloud.database();
// pages/my/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: '1',
    obj: {}, //保存用户信息
    isLogin: false, //是否登录。 false 未登录  true，已经登录
    recipes: [],
    imgList: [
      '../../static/type/type01.jpg',
      '../../static/type/type02.jpg',
      '../../static/type/type03.jpg',
      '../../static/type/type04.jpg',
      '../../static/type/type05.jpg',
      '../../static/type/type06.jpg'
    ],
    types: [],
    allLike: [], //保存所属当前用户的菜单列表
    allMenuList: [] //保存所有的关注信息
  },
  // 跳转pbrecipe页
  toPbrec() {
    wx.navigateTo({
      url: '/pages/pbrecipe/pbrecipe',
    })
  },
  async _delStyle(e) {
    let mid = e.currentTarget.dataset.mid;
    wx.showModal({
      title: "删除提示",
      content: "确定要删除么？",
      success: async (res) => {
        let files = await this.deleteFile(mid);
        // console.log(files);
        if (res.confirm) {
          wx.showLoading({
            title:'删除中...'
          })
          // 删除menu菜谱及其相关的图片
          await Promise.all(remove('menu', mid), removeCloud(files)).catch(err => {
            console.log(err);
            return;
          })
          // 利用云函数批量删除与菜单相关的likes集合
          this.batchDel(mid)
          this.getMenuInfo();
        }
      }
    })
  },
  // 定义函数进行批量删除操作
  batchDel(id){
    wx.cloud.callFunction({
      name:'delsome',
      data:{
        mid:id
      }
    }).then(res=>{
      wx.showToast({
        title: '删除成功！',
        duration:600
      })
    }).catch(err=>{
      console.log(err);
      return;
    })
  },
  // 获取一条记录，获取fileID从存储中进行删除
  async deleteFile(id) {
    let res = await getOne('menu', id).catch(err => {
      console.log(err);
      return;
    })
    return res.data.images;
  },
  // 页面加载判断是否登录过
  onLoad() {
    // 重新调用函数进行登录判断
    this.toLogin();
    this.getTypeInfo();
    this.getMenuInfo();
    this.getLikeList();
  },
  // 根据登录本地的用户获取当前用户收藏的菜谱
  async getLikeList() {
    // 从本地获取user的id
    let userid = wx.getStorageSync('openid');
    let res = await get('likes', {
      _openid: userid
    }).catch(err => {
      console.log(err);
      return;
    })
    // console.log(res);return;
    this.setData({
      allLike: res.data
    })
    // 获取到地址保存到arr中
    let arr = this.data.allLike.map(item => {
      return item.menuid
    })
    /*
      根据地址获取数据，result是一个对象型数组
      通过command.in进行获取,提高性能
    */
    db.collection('menu').where({
        _id: db.command.in(arr)
      }).get()
      .then(res => {
        let dataList = res.data
        // 计算要显示的星星
        dataList.forEach(item => {
          item.star = getStar(item.view)
        })
        this.setData({
          allMenuList: dataList
        })
      })
    // let res = await get('menu',{
    //   _id:db.command.in(arr)
    // })
    // let result =await Promise.all(arr.map(item=>{
    //   return getOne('menu',item).catch(err=>{return})
    // })).catch(err=>{console.log(err);return;})
  },
  // 封装获取type的数据
  async getTypeInfo() {
    // 页面加载获取type数据
    let result = await get('type').catch(err => {
      console.log(err);
      return;
    })
    this.setData({
      types: result.data
    })
  },
  // 封装获取自己发布的菜品
  async getMenuInfo() {
    let id = wx.getStorageSync('openid')
    let result = await get('menu', {
      _openid: id
    }).catch(err => {
      console.log(err);
      return;
    })
    // 接收到的数据倒序输出,最新发布的在上方
    let datalist = result.data.sort(function (a, b) {
      return b.addTime - a.addTime
    })
    this.setData({
      recipes: datalist
    })
  },
  // 点击登录
  toLogin() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // console.log(res.userInfo);
              this.setData({
                obj: res.userInfo,
                isLogin: true
              })
            }
          })
        }
      }
    })
  },
  // 菜单，分类，关注切换
  myNav(e) {
    // console.log(e.currentTarget.dataset.idx);
    this.setData({
      activeIndex: e.currentTarget.dataset.idx
    })
  },
  // 点击跳转详情页
  toDetail(e) {
    // console.log(e.currentTarget.dataset.mid);
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.mid,
    })
  },
  // 跳转菜谱相关的列表,传id和name
  toMenuList(e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '/pages/list/list?id=' + e.currentTarget.dataset.tid + '&name=' + e.currentTarget.dataset.tname,
    })
  },
})