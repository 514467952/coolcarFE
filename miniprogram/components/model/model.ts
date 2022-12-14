import { ModalResult } from "./type"

// components/model/model.ts
Component({
  properties: {
    showModal: Boolean,
    showCancel: Boolean,
    title: String,
    contents: String,
  },
  options: {
    //用全局class，将colorui的css属性引用
    addGlobalClass: true,
  },
  data: {
    resolve: undefined as ((r:ModalResult) => void) | undefined
  },
  methods: {
    onCancel() {
        this.hideModal('cancel')
    },

    onOK() {
        this.hideModal('ok')
    },

    hideModal(res: ModalResult) {
        this.setData({
            showModal: false,
        })
        this.triggerEvent(res)
        if (this.data.resolve) {
            this.data.resolve(res)
        }
    },

    showModal(): Promise<ModalResult> {
        this.setData({
            showModal: true,
        })
        return new Promise((resolve) => {
            this.data.resolve = resolve
        })
    }
  }
})
