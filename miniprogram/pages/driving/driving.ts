// pages/driving/driving.ts
const centPerSec = 0.5

//格式化时间
function formatDuration(sec: number) { 
  const padString = (n: number) =>
    n < 10 ? '0' + n.toFixed(0) : n.toFixed(0)
  const h = Math.floor(sec/3600)
  sec -= 3600*h;
  const m = Math.floor(sec / 60)
  sec -= 60 *m
  const s = Math.floor(sec)
  return `${padString(h)}:${padString(m)}:${padString(s)}`
}

//算钱
function formatFee(cents: number) {
  return (cents/100).toFixed(2)
}

Page({
  timer: undefined as number | undefined,
  data:{
    location: {
      latitude: 32.92,
      longitude: 118.46,
    },
    scale: 14,
    elapsed: '00:00:00',
    fee: '0.00',
  },

  onLoad(opt) {
    //获取从开锁页面传过来的行程id
    console.log("获取当前行程:",opt.tripID)
    this.setupLocationUpdator()
    this.setupTimer()
  },

  onUnload() {
    wx.stopLocationUpdate()
    if(this.timer) {
      clearInterval(this.timer)
    }
  },

  //设置实时的位置
  setupLocationUpdator() {
    wx.startLocationUpdate({
      fail: (res) => console.log(res),
    })
    wx.onLocationChange(loc => {
      console.log("实时位置信息:",loc)
      this.setData({
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
      })
    })
  },

  //设置实时的时间
  setupTimer() {
    let elapsedSec = 0;
    let cents = 0;
    this.timer = setInterval(()=> {
      elapsedSec++
      cents += centPerSec
      this.setData({
        fee: formatFee(cents),
        elapsed: formatDuration(elapsedSec),
      })
    },1000)
  },
})