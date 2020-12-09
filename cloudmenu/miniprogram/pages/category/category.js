import {
  get,
  remove,
  add,
  getOne,
  update
} from '../../utils/db'
let query = wx.createSelectorQuery()
Page({
  data: {
    typeList: [], //保存分类列表
    showUpdate: false, //控制更新显示
    showAdd: false, //控制添加显示
    addVal: '', //添加input框内容
    upVal: '', //更新input框内容
    upTid: '' //保存要修改的typeid
  },
  // 从数据库获取数据进行渲染
  getTypeInfo() {
    get('type').then(res => {
      this.setData({
        typeList: res.data
      })
    })
  },
  // 页面加载获取type中的数据
  onLoad() {
    this.getTypeInfo();
  },
  // 点击加号显示添加input
  showAdd() {
    this.setData({
      showAdd: true
    })
  },
  // 实时监听添加input中的内容
  getVal(e) {
    if (e.detail.value === undefined) {
      return;
    };
    this.setData({
      addVal: e.detail.value,
      upVal: e.detail.value
    })

  },
  // 点击添加向type数据库中添加数据
  async toAdd(e) {
    // console.log(e.target.dataset);
    if (e.target.dataset.addVal === undefined || e.target.dataset == {}) {
      return;
    }
    if (e.target.dataset.addVal == '') {
      wx.showToast({
        title: '添加内容不能空',
        duration: 500,
        icon: 'none'
      })
      this.setData({
        showAdd: false
      })
      return;
    }
    // 向数据库添加数据
    await add('type', {
      name: e.target.dataset.addVal
    }).catch(err => {
      console.log(err);
      return
    })
    this.getTypeInfo();
    this.setData({
      showAdd: false,
      addVal: ''
    })
  },
  // 删除菜谱
  delType(e) {
    // console.log(e.currentTarget.dataset.tid);
    wx.showModal({
      title: '确定删除吗？',
      success: res => {
        // console.log(res.confirm);
        // 判断是否删除
        if (res.confirm) {
          remove('type', e.currentTarget.dataset.tid)
            .then(res => {
              this.getTypeInfo();
              wx.showToast({
                title: '删除成功！',
                duration: 600
              })
            }).catch(err => {
              return;
            })
        } else {
          wx.showToast({
            title: '已取消',
            duration: 500
          })
        }
      }
    })
  },
  // 修改菜谱名称
  async upType(e) {
    // console.log(e.currentTarget.dataset.tid);
    // 根据id获取当前数据
    let res = await getOne('type', e.currentTarget.dataset.tid).catch(err => {
      console.log(err);
      return;
    })
    this.setData({
      showUpdate: true,
      upVal: res.data.name,
      upTid: e.currentTarget.dataset.tid
    })
  },
  // 修改提交到数据库
  async toUpdate(e) {
    if (e.target.dataset.upVal === undefined || e.target.dataset == {}) {
      return;
    }
    if (e.target.dataset.upVal == '') {
      wx.showToast({
        title: '更新内容不能空',
        duration: 500,
        icon: 'none'
      })
      return;
    }
    // 调用数据库的更新操作
    let res = await update('type', this.data.upTid, {
      name: this.data.upVal
    }).catch(err => {
      console.log(err);
      return;
    })
    this.getTypeInfo();
    this.setData({
      showUpdate: false
    })
    wx.showToast({
      title: '更新成功！',
      duration: 600
    })
  }
})