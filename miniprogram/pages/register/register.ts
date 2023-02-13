import { parse } from "protobufjs"
import { ProfileService } from "../../service/profile"
import { rental } from "../../service/proto_gen/rental/rental_pb"
import { padString } from "../../utils/format"
import { routing } from "../../utils/routing"

//处理日期
function formatDate(millis: number) {
  const dt = new Date(millis)
  const y = dt.getFullYear()
  const m = dt.getMonth() + 1
  const d = dt.getDate()
  return `${padString(y)}-${padString(m)}-${padString(d)}`
}

// pages/register/register.ts
Page({
  redirectURL: "",
  profileRefresher:0,

  data: {
    licNo: "",
    name: "",
    birthDate: "1990-01-01",
    gendersIndex:0,
    genders:["未知","男","女","其他"],
    licImgURL: "",
    // state: "UNSUBMITTED" as "UNSUBMITTED" | "PENDING" | "VERIFIED",
    state: rental.v1.IdentityStatus[rental.v1.IdentityStatus.UNSUBMITTED],
  },

  //将个人信息显示
  renderProfile(p: rental.v1.IProfile) {
    this.setData({
      licNo:p.identity?.licNumber || "",
      name: p.identity?.name || "",
      gendersIndex:p.identity?.gender || 0,
      birthDate: formatDate(p.identity?.birthDateMillis || 0),
      state: rental.v1.IdentityStatus[p.identityStatus || 0],
    })
  },

  onLoad(opt: Record<"redirect",string>) {
    const o: routing.RegisterOpts = opt
    if(o.redirect) {
      this.redirectURL = decodeURIComponent(o.redirect)
    }
    ProfileService.getProfile().then(p => this.renderProfile(p))
  },

  onUnload() {
    this.clearProfileRefresher()
  },

  onBirthDayChange(e:any) {
    this.setData({
      birthDate:e.detail.value,
    })
  },
  //性别选择
  onGenderChange(e:any) {
    this.setData({
      //性别转成数字
      gendersIndex:parseInt(e.detail.value),
    })
  },
  
  //上传驾照
  onUploadLic() {
    wx.chooseMedia({
      success: res => {
        if(res.tempFiles) {
          this.setData({
            licImgURL: res.tempFiles[0].tempFilePath,
          })

          //ToDo- 更新信息
          setTimeout(() => {
            this.setData({
              licNo:"3252452345",
              name:"张三",
              gendersIndex:1,
              birthDate:"1989-12-02",
            })
          }, 1000);
        }
      }
    })
  },

  //提交数据
  onSubmit() {
    ProfileService.submitProfile({
      licNumber: this.data.licNo,
      name: this.data.name,
      gender: this.data.gendersIndex,
      birthDateMillis: Date.parse(this.data.birthDate),
    }).then(p => {
      this.renderProfile(p)
      this.scheduleProfileRefresher()
    })
  },

  scheduleProfileRefresher() {
    this.profileRefresher =  setInterval(() => {
      ProfileService.getProfile().then(p=>{
        this.renderProfile(p)
        if (p.identityStatus !== rental.v1.IdentityStatus.PENDING) {
          this.clearProfileRefresher()
        }
        if (p.identityStatus === rental.v1.IdentityStatus.VERIFIED) {
          this.onLicVerifed()
        }
      })
    },1000)
  },

  clearProfileRefresher() {
    if (this.profileRefresher) {
      clearInterval(this.profileRefresher)
      this.profileRefresher = 0
    }
  },

  //重新提交
  onReSubmit(){
    ProfileService.clearProfile().then(p=>this.renderProfile(p))
  },

  onLicVerifed() {
    if (this.redirectURL) {
      wx.redirectTo({
        url:this.redirectURL,
      })
    }
  }
})