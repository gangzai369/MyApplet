import {get} from '../../utils/db'
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch:[],//热门搜索
    nearSearch:[],//近期搜索
    inpval:''//保存input的值
  },
  onLoad(){
    this.getNearList()
    this.getMenuList()
  },
  // 从menu数据库中获取数据
  async getMenuList(){
    let res = await get('menu').catch(err=>{console.log(err);return;})
    let arr = res.data.sort(function(a,b){
      return b.view - a.view
    })
    // 截取前9条
    let brr = arr.splice(0,9);
    this.setData({
      hotSearch:brr
    })
  },
  // 监听input的值
  inpVal(e){
    this.setData({
      inpval:e.detail.value
    })
  },
  // 点击搜索
  toSearch(){
    let val = this.data.inpval.trim();
    if(val==''){
      wx.showToast({
        title: '输入不能为空!',
        icon:'none',
        duration:600
      })
      return;
    }
    let arr = wx.getStorageSync('sVal')||[];
    // 判断是否已经存在
    arr.forEach((item,index)=> {
      if(item==val){
        arr.splice(index,1);
      }
    })
    arr.unshift(val);
    // 把搜索的内容添加到本地缓存
    wx.setStorageSync('sVal', arr)
    // 获取本地数据
    this.getNearList();
    // 携带搜索内容跳转list页面
    wx.navigateTo({
      url: '/pages/list/list?val='+val,
    })
  },
  // 点击模块跳转列表页
  toList(e){
    // console.log(e.currentTarget.dataset.val);
    this.setData({
      inpval:e.currentTarget.dataset.val
    })
    this.toSearch()
  },
  // 页面加载获取本地近期搜索
  getNearList(){
    let arr = wx.getStorageSync('sVal')
    this.setData({
      nearSearch:arr
    })
  }

})