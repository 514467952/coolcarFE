
import { coolcar } from "./service/proto_gen/trip_pb"

// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    wx.request({
      url:"http://106.54.49.241:8080/trip/trip123",
      method: "GET",
      success: res => {
        const getTripRes = coolcar.GetTripResponse.fromObject(res.data as object)
        console.log(getTripRes)
        //验证下枚举类型
        console.log("status is",coolcar.TripStatus[getTripRes.trip?.status!])
      },
      fail: console.error,
    })

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})