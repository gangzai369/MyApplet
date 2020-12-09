import {
  get,
  update,
  getOne,
  add,
  remove
} from '../../utils/db'
// pages/detail/detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    view: 0, //保存浏览量
    likes: 0, //保存收藏数
    islike: true, //保存是否收藏
    obj: {}, //保存详情信息
    menuId: '', //保存当前菜谱的id
    likeId: '', //保存当前用户收藏菜谱的唯一id
    likeList: [], //保存like中的数据
  },
  onLoad(query) {
    this.getMenuDetail(query.id);
  },
  // 获取菜品详情
  async getMenuDetail(id) {
    let res = await getOne('menu', id).catch(err => {
      console.log(err);
      return;
    })
    this.setData({
      obj: res.data,
      view: res.data.view,
      likes: res.data.likes,
      menuId: id
    })
    wx.setNavigationBarTitle({
      title:this.data.obj.name
    })
    this.updateInfo(id)
    this.getList();
  },
  // 修改menu集合信息，每次一加载观看数加1
  async updateInfo(id) {
    this.setData({
      view: this.data.view + 1
    })
    // console.log(this.data.view,'ggengenge');
    await update('menu', id, {
      view: this.data.view
    }).catch(err => {
      console.log(err);
      return;
    })
  },
  // 修改集合信息，每 次收藏加1，取消减1
  async updateLike(id) {
    // console.log(this.data.view,'ggengenge');
    await update('menu', id, {
      likes: this.data.likes
    }).catch(err => {
      console.log(err);
      return;
    })
  },
  // 页面加载获取like表,判断是否已经收藏
  async getList() {
    let res = await get('likes').catch(err => {
      console.log(err);
      return;
    })
    this.setData({
      likeList: res.data
    });
    let userId = wx.getStorageSync('openid');
    // 判断当前用户是否收藏了该页面
    this.data.likeList.forEach(item => {
      if (item.menuid == this.data.menuId && item._openid == userId) {
        this.setData({
          islike: false,
          likeId: item._id
        })
      }
    })
  },
  //图片预览
  previewImage() {
    wx.previewImage({
      urls: this.data.obj.images,
    })
  },
  // 点击关注和取消
  async userLike() {
    this.setData({
      islike: !this.data.islike
    })
    // console.log(this.data.menuId);
    wx.getStorageSync('openid')
    if (!this.data.islike) {
      // 添加
      let res = await add('likes', {
        menuid: this.data.menuId
      }).catch(err => {
        console.log(err);
        return;
      })
      // 收藏加1
      this.setData({
        likeId: res._id,
        likes: this.data.likes + 1
      })
      this.updateLike(this.data.menuId)
    } else {
      // 取消关注减1
      this.setData({
        likes: this.data.likes - 1
      })
      this.updateLike(this.data.menuId)
      // 删除like中的数据
      await remove('likes', this.data.likeId).catch(err => {
        console.log(err);
        return;
      })
    }
  },
  // 返回
  toBack() {
    wx.navigateBack();
  }
})