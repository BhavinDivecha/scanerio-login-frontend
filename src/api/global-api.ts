import axios from "axios"

export const postAudit=async(payload:any)=>{
    const res=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/submit-url`, payload, {withCredentials: true}).then((res)=>res).catch((err)=>err)
    return res
}