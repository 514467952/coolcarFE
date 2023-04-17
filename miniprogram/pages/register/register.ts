
import { ProfileService } from "../../service/profile"
import { rental } from "../../service/proto_gen/rental/rental_pb"
import { padString } from "../../utils/format"
import { routing } from "../../utils/routing"
import { Coolcar } from "../../service/request"

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
    this.renderIdentity(p.identity!)
    this.setData({
      state: rental.v1.IdentityStatus[p.identityStatus || 0],
    })
  },

  //将个人信息展示
  renderIdentity(i ?: rental.v1.IIdentity) {
    this.setData({
      licNo:i?.licNumber || "",
      name: i?.name || "",
      gendersIndex:i?.gender || 0,
      birthDate: formatDate(i?.birthDateMillis || 0),
    })
  },

  onLoad(opt: Record<"redirect",string>) {
    const o: routing.RegisterOpts = opt
    if(o.redirect) {
      this.redirectURL = decodeURIComponent(o.redirect)
    }
    //获取个人信息
    ProfileService.getProfile().then(p => this.renderProfile(p))
    //获取照片信息
    ProfileService.getProfilePhoto().then(p => {
      this.setData({
        licImgURL: p.uploadUrl || "",
      })
    })
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
      success: async res => {
        if (res.tempFiles[0].size == 0) {
          return
        }
        this.setData({
          licImgURL: res.tempFiles[0].tempFilePath
        })

        //创建图片
        const photoRes = await ProfileService.createProfilePhoto()

        if (!photoRes.uploadUrl) {
          return
        }
        //上传图片
        await Coolcar.uploadfile({
          localPath: res.tempFiles[0].tempFilePath,
          url: photoRes.uploadUrl!,
        })
        //通知服务器上传成功
        const identity = await ProfileService.completeProfilePhoto()
        this.renderIdentity(identity)
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
    //清除个人信息
    ProfileService.clearProfile().then(p=>this.renderProfile(p))
    //清除图片信息
    ProfileService.clearProfilePhoto().then(() => {
      this.setData({
        licImgURL: "",
      })
    })
  },

  onLicVerifed() {
    if (this.redirectURL) {
      wx.redirectTo({
        url:this.redirectURL,
      })
    }
  }
})