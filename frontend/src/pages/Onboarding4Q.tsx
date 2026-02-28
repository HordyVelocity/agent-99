import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { TdmHeader } from "../components/TdmHeader"

const C="#101213",G="#B8973A",W="#FFFFFF",O="#F7F6F4",B="#E4E2DD",M="#8A8784"
const F="'Inter',system-ui,-apple-system,sans-serif"

const QUESTIONS=[
  {id:"ob1",label:"Who are you completing this for?",options:["Myself as an Individual","Myself as a Sole Trader","For myself as a Business Owner","My Accountancy Client","My Advisory/Brokerage Client"]},
  {id:"ob2",label:"What has the ATO done so far?",options:["None","General debt warning letter","Firmer action warning letter","Director Penalty Notice (DPN)","Default / Credit reporting","Bankruptcy / Wind-up notice"]},
  {id:"ob3",label:"Approximately how much is owed?",options:["$20k \u2013 $100k","$100k \u2013 $200k","$200k \u2013 $300k","$300k \u2013 $500k","$500k \u2013 $750k","$750k+"]},
  {id:"ob4",label:"What outcome are you hoping for?",options:["Payment arrangement + attempt remission of interest & penalties","Attempt remission of interest & penalties only","Wind down responsibly"]},
]

export default function Onboarding4Q(){
  const navigate=useNavigate()
  const [current,setCurrent]=useState(0)
  const [answers,setAnswers]=useState<Record<string,string>>({})
  const [selected,setSelected]=useState("")
  const q=QUESTIONS[current]
  const progress=Math.round(((current)/QUESTIONS.length)*100)

  useEffect(()=>{
    const saved=answers[q.id]
    if(saved)setSelected(saved)
    else setSelected("")
  },[current])

  const handleSelect=(opt:string)=>{
    setSelected(opt)
    setAnswers(prev=>({...prev,[q.id]:opt}))
  }

  const goNext=()=>{
    if(!selected)return
    if(current===QUESTIONS.length-1){
      const allAnswers={...answers,[q.id]:selected}
      localStorage.setItem("ascend_4q",JSON.stringify(allAnswers))
      window.location.href="https://ascend-membership.flutterflow.app/page001ASignin"
      return
    }
    setCurrent(c=>c+1)
  }

  const goBack=()=>{
    if(current===0){navigate("/onboarding-2");return}
    setCurrent(c=>c-1)
  }

  return(
    <div style={{minHeight:"100vh",background:O,fontFamily:F}}>
      <TdmHeader />
      <div style={{maxWidth:"580px",margin:"0 auto",padding:"40px 24px"}}>
        <p style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.16em",color:G,textAlign:"center",marginBottom:"8px",textTransform:"uppercase"}}>Quick Qualification</p>
        <p style={{fontSize:"0.75rem",color:M,textAlign:"center",marginBottom:"28px"}}>Question {current+1} of {QUESTIONS.length}</p>
        <div style={{height:"3px",background:B,borderRadius:"2px",marginBottom:"32px"}}>
          <div style={{height:"3px",background:G,borderRadius:"2px",width:progress+"%",transition:"width 0.3s ease"}}/>
        </div>
        <div style={{background:W,borderRadius:"16px",border:"1px solid "+B,padding:"36px 32px",boxShadow:"0 2px 24px rgba(0,0,0,0.05)"}}>
          <h2 style={{fontSize:"1.05rem",fontWeight:600,color:C,marginBottom:"24px",lineHeight:1.5}}>{q.label}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"28px"}}>
            {q.options.map(opt=>(
              <button key={opt} onClick={()=>handleSelect(opt)} style={{padding:"13px 16px",borderRadius:"9px",border:selected===opt?"1.5px solid #2E3235":"1.5px solid #E4E2DD",background:selected===opt?"#F4F3F1":W,color:C,fontWeight:selected===opt?600:400,fontSize:"0.82rem",cursor:"pointer",transition:"all 0.15s ease",fontFamily:F,textAlign:"left",boxShadow:selected===opt?"0 2px 8px rgba(16,18,19,0.08)":"none"}}>{opt}</button>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button onClick={goBack} style={{padding:"10px 18px",borderRadius:"8px",border:"1.5px solid "+B,background:"transparent",color:current===0?B:C,fontSize:"0.78rem",cursor:"pointer",fontFamily:F,fontWeight:500}}>\u2190 Back</button>
            <button onClick={goNext} disabled={!selected} style={{padding:"11px 26px",background:selected?"#4A4D50":B,color:selected?W:M,border:"none",borderRadius:"9px",fontSize:"0.83rem",fontWeight:600,cursor:selected?"pointer":"not-allowed",fontFamily:F,transition:"all 0.2s",boxShadow:selected?"0 2px 10px rgba(16,18,19,0.2)":"none"}}>
              {current===QUESTIONS.length-1?"Continue to Sign Up":"Next"} \u2192
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
