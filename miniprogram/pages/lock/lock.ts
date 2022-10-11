import { routing } from "../../utils/routing";

// pages/lock/lock.ts
const shareLocationKey = "share_location"
const avaterURLKey = "avater_url";

Page({
  data: {
    shareLocation: false,
    avaterURL: "",
  },
  onLoad(opt:Record<"car_id",string>) {
    const o: routing.LockOpts = opt;
    //开锁后，需要知道开的是哪辆车的锁
    console.log("unlocking car",o.car_id)
    const userInfo = getApp<IAppOption>().globalData.userInfo;
    if (userInfo) {
      this.setData({
        avaterURL: userInfo.avatarUrl,
      })
    }
    console.log("开锁页面加载")
  },
  //开锁页面获取用户信息
  onGetUserInfo() {
    console.log("请求获取用户信息")
    wx.getUserProfile({
      desc: '租辆酷车需要获取你的头像',
      success: (res) => {
        console.log("回调回来的用户信息:", res.userInfo)
        this.setData({
          avaterURL: res.userInfo.avatarUrl,
        })
        getApp<IAppOption>().globalData.userInfo = res.userInfo;
        wx.showToast({
          title: "获取头像中",
          icon: "loading",
        })
      }
    })
  },

  //用户控制是否展示自己的头像
  onShareLocation(e: any) {
    const shareLocation: boolean = e.detail.value
    //本地记录一份
    wx.setStorageSync(shareLocationKey, shareLocation)
  },

  //开锁按钮点击
  onUnLockTap() {
    wx.getLocation({
      type: "gcj02",
      success: res => {
        //告诉服务器我们的位置
        console.log("开始路程", {
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          avaterURL: this.data.avaterURL,
        });
        //创建行程
        const tripID = "trip456";

        wx.showLoading({
          title: "开锁中",
          mask: true,
        }),
        //模拟开锁成功的动作
        setTimeout(() => {
          wx.redirectTo({
            // url: `/pages/driving/driving?trip_id=${tripID}`,
            url: routing.driving({
              trip_id:tripID
            }),
            complete: () => {
              wx.hideLoading()
            }
          })
        }, 2000)
      },
      fail: res => {
        console.log("开锁失败",res),
        wx.showToast({
          title:"请前往设置页面授权",
          icon: "none",
        })
      },
    })
  },
})