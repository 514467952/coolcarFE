import { auth } from "./proto_gen/auth/auth_pb"

export namespace Coolcar {

    const serverAddr = "http://106.54.49.241:8080"
    const AUTH_ERR = "AUTH_ERR"
    const authData = {
        token: '', 
        expiryMs: 0, //表示token什么时候过期
    }

    //定义请求参数
    //<REQ>表示请求强类型
    //<RES>表示请求返回强类型
    interface RequestOption<REQ,RES> {
        method: "GET"|"PUT"|"POST"|"DELETE"
        path: string
        data?: REQ
        respMarshaller: (r: object)=>RES
    }

    export interface AuthOption {
        attachAuthHeader: boolean  //请求时头部header是否需要携带
        retryOnAuthError: boolean
    }


    export async function sendRequestWithAuthRetry<REQ,RES>(o:RequestOption<REQ,RES>, a?: AuthOption):Promise<RES> {
        const authOpt = a || {
            attachAuthHeader: true,
            retryOnAuthError: true,
        }
        try {
            await Login()
            return sendRequest(o,authOpt)
        } catch(err) {
            if (err === AUTH_ERR && authOpt.retryOnAuthError) {
                //重试登录请求
                authData.token = ""
                authData.expiryMs = 0
                return sendRequestWithAuthRetry(o,{
                    attachAuthHeader: authOpt.attachAuthHeader,
                    retryOnAuthError: false,
                })
            } else {
                throw err
            }
        }
    }

    //登录请求
    export async function Login() {
        if (authData.token && authData.expiryMs >= Date.now()) {
            //如果token有效，不需要登录
            return;
        }
        const wxResp = await wxLogin()
        const reqTimeMS = Date.now()
        const resp = await sendRequest<auth.v1.ILoginRequest,auth.v1.ILoginResponse>({
            method:"POST",
            path:"/v1/auth/login",
            data: {
                code: wxResp.code,
            },
            respMarshaller: auth.v1.LoginResponse.fromObject
        },{
            attachAuthHeader:false,
            retryOnAuthError:false,
        })
        authData.token = resp.accessToken!
        authData.expiryMs = reqTimeMS + resp.expiresInSec! * 1000
    }

    //公用的发送请求方法
    function sendRequest<REQ,RES>(o:RequestOption<REQ,RES>, a: AuthOption):Promise<RES> {
        return new Promise((resolve,reject) => {
            const header: Record<string,any> = {}
            if (a.attachAuthHeader) {
                if (authData.token && authData.expiryMs >= Date.now()) {
                    //token有效，再往拼接到header中
                    header.authorization = "Bearer " + authData.token
                } else {
                    reject(AUTH_ERR)
                    return
                }
            }

            wx.request({
                url: serverAddr + o.path,
                method: o.method,
                data: o.data!,
                header: header,
                success: res => {
                    if (res.statusCode === 401) {
                        reject(AUTH_ERR)
                    } else if (res.statusCode >= 400) {
                        reject(res) 
                    } else {
                        resolve(o.respMarshaller(res.data as Object))
                    }
                },
                fail: reject,
            })
        })
    }


    //将微信登录api改成Promise形式
    function wxLogin(): Promise<WechatMiniprogram.LoginSuccessCallbackResult>{
        return new Promise((resolve,reject)=> {
            wx.login({
                success:resolve,
                fail:reject
            })
        })
    }
}