// 导入封装的数据库
import {
  get
} from '../../utils/db.js'
// pages/type/type.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    types: [],
    img: [
      '../../static/type/type01.jpg',
      '../../static/type/type02.jpg',
      '../../static/type/type03.jpg',
      '../../static/type/type04.jpg',
      '../../static/type/type05.jpg',
      '../../static/type/type06.jpg'
    ]
  },
  // 从菜谱类型获取数据
  async onLoad() {
    let res = await get('type').catch(err => {
      console.log(err);
    })
    this.setData({
      types: res.data
    })
  },
  // 跳转菜谱相关的列表,传id
  toMenuList(e){
    wx.navigateTo({
      url: '/pages/list/list?id='+e.currentTarget.dataset.tid+'&name='+e.currentTarget.dataset.tname,
    })
  }

})