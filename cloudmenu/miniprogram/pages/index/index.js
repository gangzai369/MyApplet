// 引入数据库方法
import {
    get,
    getLimit
} from '../../utils/db'
const db = wx.cloud.database()
Page({
    data: {
        dataList: [], //保存后台获取的菜品
        page: 1,
        pageSize: 6,
        createTime: db.serverDate() //添加该字段
    },
    // 重新请求数据库进行数据加载
    onLoad() {
        let {
            page,
            pageSize
        } = this.data;
        this.getPage(page, pageSize)
    },
    // 封装根据页码获取信息
    async getPage(page, pageSize) {
        let skip = (page - 1) * pageSize;
        let result = await getLimit("menu", {}, 'addTime', 'desc', skip, pageSize).catch(err => {
            console.log(err);
            return;
        })
        this.setData({
            dataList: this.data.dataList.concat(result.data)
        })
        return result;
    },
    // 触底加载更多菜品
    async onReachBottom() {
        this.data.page += 1;
        let {
            page,
            pageSize
        } = this.data;
        let res = await this.getPage(page, pageSize)
        if(res.data.length==0){
            wx.showToast({
              title: '已经到底了~',
              duration:600,
              icon:'none'
            })
        }
    },
    // 监听用户下拉动作
    onPullDownRefresh: async function () {
        this.setData({
            dataList:[]
        })
        await this.getPage(1, 6) //重新调用获取函数
        wx.stopPullDownRefresh();
        wx.showToast({
            title: '刷新完成',
            duration: 450
        })
    },
    // 跳转详情页
    toDetail(e) {
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + e.currentTarget.dataset.mid,
        })
    },
    // 跳转菜谱分类页
    toType() {
        wx.navigateTo({
            url: '/pages/type/type',
        })
    },
    // 跳转到详情页
    toList() {
        wx.navigateTo({
            url: '/pages/list/list?look=我的关注',
        })
    },
    // 跳转添加分类页
    addSort() {
        wx.navigateTo({
            url: '/pages/category/category',
        })
    }
})