export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

//export 修饰的函数不只是当前文件能使用，别的文件也能调用
export function lycGetSetting():Promise<WechatMiniprogram.GetUserProfileSuccessCallbackResult> {
  return new Promise((resolve,reject) => {
    wx.getUserProfile({
      //第一个参数
      desc: '展示用户信息',
      //第二个参数，成功回调:返回一个res，用外部传来的resolve回调函数去处理
      success: res => resolve(res),
      //第三个参数，错误回调：返回一个err，用外部传来的reject回调函数去处理
      fail:err => reject(err),
    })
  })
}