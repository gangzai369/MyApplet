import {
  get,
  getOne
} from '../../utils/db'
import {
  getStar
} from '../../utils/tools'
// pages/list/list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '', //保存跳转来的标题
    dataList: [], //保存获取的数据
    lists: [],
    isLogin: true //判断是否登录
  },
  // 加载页面数据加载
  onLoad(e) {
    // console.log(e);
    if (e.val) {
      this.getFromSearch(e.val)
      this.setData({
        title: e.val
      })
    } else if (e.look) {
      this.getLikeList()
      this.setData({
        title: e.look
      })
    } else {
      this.getMenuList(e.id, e.name)
      this.setData({
        title: e.name
      })
    }
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    wx.getSetting({
      success:res=>{
        if(res.authSetting['scope.userInfo']){
          this.setData({
            isLogin:true
          })
        }else{
          this.setData({
            isLogin:false
          })
        }
      }
    })
  },
  // 从搜索页跳转获取数据
  async getFromSearch(val) {
    // 模糊查询
    let res = await get('menu').catch(err => {
      console.log(err);
      return;
    })
    let arr = [] //接收符合条件的数据
    res.data.forEach(item => {
      if (item.name.indexOf(val) != -1) {
        arr.push(item)
        item.star = getStar(item.view)
      }
    })
    this.setData({
      dataList: arr
    })
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
    this.setData({
      dataList: res.data
    })
    // 获取到地址保存到arr中
    let arr = this.data.dataList.map(item => {
      return item.menuid
    })
    // 根据地址获取数据，result是一个对象型数组
    let result = await Promise.all(arr.map(item => {
      return getOne('menu', item).catch(err => {
        return
      })
    })).catch(err => {
      console.log(err);
      return;
    })
    // 再次进行数据获取
    let list = result.map(item => {
      return item.data;
    })
    // console.log(dataList);
    // 计算要显示的星星
    list.forEach(item => {
      item.star = getStar(item.view)
    })
    this.setData({
      dataList: list
    })
  },
  // 从menu中获取数据
  async getMenuList(id, name) {
    let res = await get('menu', {
      typeid: id
    }).catch(err => {
      console.log(err);
      return;
    })
    // 计算要显示的星星
    res.data.forEach(item => {
      item.star = getStar(item.view)
    })
    this.setData({
      dataList: res.data
    })
  },
  // 点击返回上一级
  toBack() {
    wx.navigateBack()
  },
  // 跳转详情页
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.mid,
    })
  },
  // 未登录，跳转到my页面进行登录
  toMy(){
    wx.reLaunch({
      url: '/pages/my/my',
    })
  }
})