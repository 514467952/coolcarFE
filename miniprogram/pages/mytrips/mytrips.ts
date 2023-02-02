import { TripService } from "../../service/trip";
import { routing } from "../../utils/routing";

//每个cell数据结构
interface Trip {
  id: string,
  start: string,
  end: string,
  distance: string,
  duration: string,
  fee: string,
  status: string
}

//主cell的数据
interface MainItem {
  id: string,
  navID: string,
  navScrollId: string,
  data: Trip
}

//导航栏数据
interface NavItem {
  id: string,
  mainId: string,
  label: string,
}

interface MainItemQueryResult {
  id: string,
  top: number,
  dataset: {
    navId: string,
    navScrollId: string,
  }
}

// pages/mytrips/mytrips.ts
Page({
  scrollStates: {
    mainItems: [] as MainItemQueryResult[]
  },
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
    mainItems: [] as MainItem[],
    tripsHeight: 0,
    navItems: [] as NavItem[],
    mainScroll: "", //当前是哪个cell
    navCount: 0, //右侧能展示多少元素
    navSelect: "", //右侧当前选择的元素
    navScroll: "", 
  },

  async onLoad() {
    const res = await TripService.GetTrips()
    console.log(res)
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
      const wxHeight = wx.getSystemInfoSync().windowHeight - rect.height
      this.setData({
        tripsHeight: wxHeight,
        navCount: Math.round(wxHeight/40),
      })
    }).exec()
  },

  //scrollView数据
  populateTrips() {
    const mainItems: MainItem[] = []
    const navItems: NavItem[] = []
    let navSelect  = "";
    let prevNav = "";
    for(let i = 0;i < 100; i++) {
      const mainID = "main-" + i;
      const navID = "nav-" + i;
      const tripId = (10001 + i).toString()
      if (!prevNav) {
        prevNav: navID
      }
      mainItems.push({
        id: mainID,
        navID: navID,
        navScrollId: prevNav,
        data: {
          id: tripId,
          start: "东方明珠",
          end: "迪士尼",
          distance: "27公里",
          duration: "0时44分",
          fee: "128.00元",
          status: "已完成",
        }
      }),
      navItems.push({
        id:navID,
        mainId: mainID,
        label: tripId,
      })
      if (i === 0) {
        navSelect = navID
      }
      prevNav = navID
    }
    this.setData({
      mainItems,
      navItems,
      navSelect,
    },() => {
      this.prepareScrollStates()
    })
  },

  //计算scrollView中所有cell的高度
  prepareScrollStates() {
    wx.createSelectorQuery().selectAll(".main-item").fields({
      id: true,
      dataset: true,
      rect: true,
    }).exec(res => {
      console.log(res)
      this.scrollStates.mainItems = res[0]
    })
  },

  //轮播图事件
  onSwiperChange() {
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
  },

  //点击右侧导航栏
  onNavItemTap(e:any) {
    console.log(e)
    const mainId: string = e.currentTarget?.dataset?.mainId
    const navId: string = e.currentTarget?.id
    if (mainId) {
      this.setData({
        mainScroll:mainId,
        navSelect: navId
      })
    }
  },

  //左侧scrollView滚动
  onMainLeftScroll(e: any) {
    console.log(e)
    const top: number = e.currentTarget?.offsetTop + e.detail.scrollTop
    if (top === undefined) {
      return
    }
    const selItem =  this.scrollStates.mainItems.find(v => v.top >= top)
    if (!selItem) {
      return
    }

    this.setData({
      navSelect: selItem.dataset.navId,
      navScroll: selItem.dataset.navScrollId,
    })
  }
})