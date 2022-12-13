
import { auth } from "./service/proto_gen/auth/auth_pb"
import {rental} from "./service/proto_gen/rental/rental_pb"

// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: "http://106.54.49.241:8080/v1/auth/login",
          method: "POST",
          data: {
            code: res.code
          } as auth.v1.ILoginRequest,
          success: res => {
            console.log(res)
            var token = res.data.accessToken
            wx.request({
              url:"http://106.54.49.241:8080/v1/trip",
              method:"POST",
              data: {
                start:"abc",
              } as rental.v1.ICreateTripRequest,
              header: {
                authorization : "Bearer" + token
              }
            })
          },
          fail: console.error,
        })
      },
    })
  },
})