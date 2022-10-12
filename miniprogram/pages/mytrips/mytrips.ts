import { routing } from "../../utils/routing";

interface Trip {
  id: string,
  start: string,
  end: string,
  distance: string,
  duration: string,
  fee: string,
  status: string
}

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
    ],
    trips: [] as Trip[],
    tripsHeight: 0,
    scrollTop: 0,
    scrollIntoView: "", //当前是哪个cell
  },

  onLoad() {
    this.populateTrips()
    const userInfo = getApp<IAppOption>().globalData.userInfo;
    if (userInfo) {
      this.setData({
        avatarURL: userInfo.avatarUrl,
      })
    }
    console.log("我的行程页面加载")
  },

  onReady() {
    //获取元素高度
    //.exec让下面代码运行
    wx.createSelectorQuery().select("#heading").boundingClientRect(rect => {
      this.setData({
        tripsHeight: wx.getSystemInfoSync().windowHeight - rect.height
      })
    }).exec()
  },

  //scrollView数据
  populateTrips() {
    const trips: Trip[] = []
    for(let i = 0;i < 100; i++) {
      trips.push({
        id: (10001 + i).toString(),
        start: "东方明珠",
        end: "迪士尼",
        distance: "27公里",
        duration: "0时44分",
        fee: "128.00元",
        status: "已完成",
      })
    }
    this.setData({
      trips,
    })
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