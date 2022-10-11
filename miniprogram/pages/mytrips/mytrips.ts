import { routing } from "../../utils/routing";

// pages/mytrips/mytrips.ts
Page({
  data: {
    avatarURL: "",
    indicatorDots: true,
    autoPlay: false,
    interval: 3000,
    duration: 500,
    circular: true,
    multiItemCount: 1,
    prevMarign: "",
    nextMarign: "",
    vertical: false,
    current: 0,
    promotionItems:[
      {
        img:"https://img1.mukewang.com/6340d874000145fb17920764.jpg",
        promotionID: 1,
      },
      {
        img:"https://img2.mukewang.com/6340e2df0001a98217920764.jpg",
        promotionID: 2,
      },
      {
        img:"https://img4.mukewang.com/6340e3280001608a17920764.jpg",
        promotionID: 3,
      },
      {
        img:"https://img1.mukewang.com/6340d874000145fb17920764.jpg",
        promotionID: 4,
      },     
    ]
  },

  onLoad() {
    const userInfo = getApp<IAppOption>().globalData.userInfo;
    if (userInfo) {
      this.setData({
        avatarURL: userInfo.avatarUrl,
      })
    }
    console.log("我的行程页面加载")
  },

  //轮播图事件
  onSwiperChange(e: any) {
    // console.log(e)
  },

  //点击轮播图事件
  onPromotionItemTap(e:any) {
    console.log(e)
    const promotionID = e.currentTarget.dataset.promotionID
    if (promotionID) {
      //do something
    }
  },

  //获取用户头像
  onGetUserInfo() {
    wx.getUserProfile({
      desc: '租辆酷车需要获取你的头像',
      success: (res) => {
        console.log("回调回来的用户信息:", res.userInfo)
        this.setData({
          avatarURL: res.userInfo.avatarUrl,
        })
        getApp<IAppOption>().globalData.userInfo = res.userInfo;
      }
    })
  },

  //跳转注册页面
  onRegisterTap() {
    wx.navigateTo({
      url: routing.register(),
    })
  }
})