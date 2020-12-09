function chooseImg(_count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: _count,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 上传图片到云端
function toCloud(tempPath) {
  let nowTime = (new Date().getTime()).toString();
  let txt = tempPath.split('.').pop();
  return wx.cloud.uploadFile({
    filePath: tempPath,
    cloudPath: nowTime + '.' + txt,
  })
}
// 获取用户信息
function getUser() {
  return wx.getSetting({
    success: res => {
      // 如果用户已经授权，获取用户信息
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo()
      }
    }
  })
}
// 计算星星数量
function getStar(view){
  let star = 0;
      if(view==0){
        star=0
      }else if(view>0&&view<=10){
        star=1
      }else if(view>10&&view<=20){
        star=2
      }else if(view>20&&view<=30){
        star=3
      }else if(view>30&&view<=40){
        star=4
      }else{
        star=5
      }
      return star;
}
// 导出函数
export {
  chooseImg,
  toCloud,
  getUser,
  getStar
}