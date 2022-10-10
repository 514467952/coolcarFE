// pages/register/register.ts
Page({
  redirectURL: "",
  data: {
    licNo: "",
    name: "",
    birthDate: "1990-01-01",
    gendersIndex:0,
    genders:["未知","男","女","其他"],
    licImgURL: "",
    state: "UNSUBMITTED" as "UNSUBMITTED" | "PENDING" | "VERIFIED",
  },
  onLoad(opt) {
    if(opt.redirect) {
      this.redirectURL = decodeURIComponent(opt.redirect)
    } 
  },
  onBirthDayChange(e:any) {
    this.setData({
      birthDate:e.detail.value,
    })
  },
  //性别选择
  onGenderChange(e:any) {
    this.setData({
      gendersIndex:e.detail.value,
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
    this.setData({
      state: "PENDING",
    })
    setTimeout(() => {
      this.onLicVerifed()
    }, 3000);
  },
  //重新提交
  onReSubmit(){
    this.setData({
      state:"UNSUBMITTED",
      licImgURL:"",
    })
  },
  onLicVerifed() {
    this.setData({
      state:"VERIFIED",
    })
    if (this.redirectURL) {
      wx.redirectTo({
        url:this.redirectURL,
      })
    }
  }
})