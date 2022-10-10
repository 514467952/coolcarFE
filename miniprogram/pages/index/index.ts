// 获取应用实例
const app = getApp<IAppOption>()

Page({
  isPageShowing: false,
  avaterURL: "",
  data: {
    // 默认值s
    setting:{
      skew: 0,
      rotate: 0,
      showLocation: true,
      showScale: true,
      subKey: '',
      layerStyle: 1,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
    },
    location: {
      latitude:31,
      longitude:120,
    },
    scale: 10,
    markers: [
      {
        iconPath:"/resources/car.png",
        id:0,
        latitude: 23.099994,
        longitude:113.324520,
        width:50,
        height:50
      },
      {
        iconPath:"/resources/car.png",
        id:1,
        latitude: 23.099994,
        longitude:114.324520,
        width:50,
        height:50
      }
    ]
  },
  onLoad() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        avaterURL: userInfo.avatarUrl,
      })
    }
    console.log("首页加载")
  },
  //扫码功能
  onScanClicked() {
    //TODO: get car id from scan result
    const carID = "car123"
    const redirectURL = `/pages/lock/lock?car_id=${carID}`
    wx.scanCode({
      success: () => {
        wx.navigateTo({
          url:`/pages/register/register?redirect=${encodeURIComponent(redirectURL)}`
        })
      },
      fail: res => console.log(res),
    })
  },

  onShow() {
    this.isPageShowing = true;
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        avaterURL: userInfo.avatarUrl,
      })
    }
    console.log("首页展示")
  },
  onHide() {
    this.isPageShowing = false
  },
  onMyLoactionTap() {
    this.newLocation()
  },
  //异步获取实时位置
  async newLocation() {
    const that = this
    try {
      await that.getWxLocation()
    } catch (error) {
      wx.showToast({
        title: "请前往设置页面将授权打开",
        icon: "none",
      })
    }
  },
  getWxLocation() {
    wx.showLoading({
      title: '定位中...',
      mask: true,
    })
    return new Promise((resolve, reject) => {
      const _locationChangeFn = (res) => {
        //res类型是OnLocationChangeCallbackResult
        this.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          }
        })
        //隐藏loading页面内
        wx.hideLoading()
        //关闭位置监听
        wx.offLocationChange(_locationChangeFn)
      }
      //开启监听
      wx.startLocationUpdate({
        success: (res) => {
          wx.onLocationChange(_locationChangeFn)
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  //移动汽车
  moveCars() {
    const mapInstance = wx.createMapContext("map")
    const dest = {
      latitude: 23.099994,
      longitude:113.324520,
    }

    const contiuneMoveCar = ()=> {
      dest.latitude += 1
      dest.longitude += 1
      mapInstance.translateMarker({
        destination: {
          latitude: dest.latitude,
          longitude: dest.longitude,
        },
        markerId:0,
        autoRotate: false,
        rotate:0,
        duration:5000,
        animationEnd: ()=> {
          if(this.isPageShowing) {
            contiuneMoveCar()
          }
        }
      })
    }
    contiuneMoveCar()
  },
  //跳转到我的行程页面
  onMyTripsTap() {
    wx.navigateTo({
      url: '/pages/mytrips/mytrips'
    })
  },
})