import { useEffect } from "react"
const C="#101213",G="#B8973A",W="#FFFFFF",O="#F7F6F4",B="#E4E2DD"
const F="'Inter',system-ui,-apple-system,sans-serif"
const URL="https://ascend-membership.flutterflow.app/page005NewCase_V4"
export default function VideoPage(){
  useEffect(()=>{window.scrollTo({top:0})},[])
  return(
    <div style={{minHeight:"100vh",background:O,padding:"48px 24px",fontFamily:F}}>
      <div style={{maxWidth:"640px",margin:"0 auto",background:W,borderRadius:"16px",border:"1px solid "+B,padding:"48px 40px",boxShadow:"0 2px 24px rgba(0,0,0,0.05)"}}>
        <p style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.16em",color:G,textAlign:"center",marginBottom:"28px",textTransform:"uppercase"}}>Welcome Aboard</p>
        <h2 style={{fontSize:"1.6rem",fontWeight:700,color:C,textAlign:"center",marginBottom:"24px"}}>Before You Begin Your Case</h2>
        <div style={{background:O,borderRadius:"12px",padding:"40px 24px",border:"1px solid "+B,marginBottom:"32px",textAlign:"center"}}>
          <p style={{fontSize:"2.5rem",marginBottom:"16px"}}>&#9654;</p>
          <p style={{fontSize:"0.9rem",color:C,fontWeight:600,marginBottom:"8px"}}>Video from Zelly - Coming Soon</p>
          <p style={{fontSize:"0.82rem",color:"#6B6966",lineHeight:1.7}}>A short 90-second message from our founder about what to expect and how we protect your interests.</p>
        </div>
        <a href={URL} style={{display:"block",width:"100%",background:C,color:W,borderRadius:"10px",padding:"16px",fontSize:"0.875rem",fontWeight:600,textAlign:"center",textDecoration:"none",boxShadow:"0 2px 12px rgba(16,18,19,0.22)"}}>Continue to Case Submission</a>
      </div>
    </div>
  )
}
