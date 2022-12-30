
// import { auth } from "./service/proto_gen/auth/auth_pb"
// import {rental} from "./service/proto_gen/rental/rental_pb"
import { Coolcar } from "./service/request"
// import { coolcar } from "./service/proto_gen/trip_pb"

// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    Coolcar.Login()
  },
})