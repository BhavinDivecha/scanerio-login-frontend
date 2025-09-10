import axios from "axios"

export const postAudit=async(payload:any)=>{
    const res=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/submit-url`, payload, {withCredentials: true}).then((res)=>res).catch((err)=>err)
    return res
}

export const logoutApi=async(payload:any)=>{
    return axios.post(`${process.env.NEXT_PUBLIC_LOGIN_URL}/api/sessions/logout`, payload, {withCredentials: true});
}

export const refreshTokenApi=async(payload:any)=>{
    return axios.post(`${process.env.NEXT_PUBLIC_LOGIN_URL}/api/auth/refresh`, payload, {withCredentials: true});
}