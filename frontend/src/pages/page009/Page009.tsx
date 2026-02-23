import { useState, useRef, useEffect, useCallback } from "react"
import { useVoiceSessionV2 } from "./useVoiceSessionV2"
import { calculateScoreLocal } from "../../lib/scoring"

const QUESTIONS = [
  {id:"q1",label:"What type of business structure?",options:["Individual / Sole Trader","Company","Trust","Partnership"]},
  {id:"q2",label:"Approximate total ATO debt?",options:["Under $10k","$10k-$50k","$50k-$200k","Over $200k"]},
  {id:"q3",label:"How long has this debt been outstanding?",options:["Less than 6 months","6 months to 1 year","1 to 2 years","Over 2 years"]},
  {id:"q4",label:"Which notices has the ATO sent?",options:["None","Overdue notice","ATO Garnishee","Statutory demand","Wind-up notice","Bankruptcy notice"]},
  {id:"q5",label:"Have BAS returns been lodged and current?",options:["Yes - all current","Mostly current","Partially lodged","Not current"]},
  {id:"q6",label:"What is the current status on income tax returns?",options:["All lodged","Small arrears","Large arrears","Never lodged"]},
  {id:"q7",label:"Have you attempted a payment plan before?",options:["No","Yes - successful","Yes - defaulted","Attempted - rejected"]},
  {id:"q8",label:"Are you currently a director of the company?",options:["Yes","No","Recently resigned"]},
  {id:"q9",label:"Has the ATO issued a Director Penalty Notice (DPN)?",options:["No","Yes - lockdown","Yes - non-lockdown","Unsure"]},
  {id:"q10",label:"Are there other personal liabilities or guarantees?",options:["No","Small amount","Significant","Overwhelming"]},
  {id:"q11",label:"How much can you contribute monthly to a payment plan?",options:["Under $500","$500-$1,500","$1,500-$3,000","Over $3,000"]},
  {id:"q12",label:"What timeframe are you seeking for a payment plan?",options:["Less than a year","1 to 2 years","2 to 3 years","Over 3 years"]},
  {id:"q13",label:"How stable is your business income?",options:["Growing","Stable","Declining","No income"]},
  {id:"q14",label:"What is your primary goal?",options:["Keep business trading","Negotiate debt reduction","Wind down responsibly","Avoid bankruptcy"]},
  {id:"q15",label:"How urgent is this situation?",options:["Planning ahead","Moderate urgency","Very urgent","ATO Action"]},
]

const CHARCOAL = "#101213"
const CHARCOAL2 = "#2A2D2E"
const GOLD = "#B8973A"
const GOLD_BG = "#FAF6ED"
const OFF_WHITE = "#F7F6F4"
const BORDER = "#E4E2DD"
const MUTED = "#8A8680"
const WHITE = "#FFFFFF"
const FONT = "'Montserrat', system-ui, sans-serif"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family: ${FONT}; }
  @keyframes pulseslow { 0%{transform:scale(1);opacity:0.45} 70%{transform:scale(1.55);opacity:0} 100%{transform:scale(1.55);opacity:0} }
  @keyframes pulsefast { 0%{transform:scale(1);opacity:0.55} 65%{transform:scale(1.6);opacity:0} 100%{transform:scale(1.6);opacity:0} }
  @keyframes pulseouter { 0%{transform:scale(1);opacity:0.2} 70%{transform:scale(1.9);opacity:0} 100%{transform:scale(1.9);opacity:0} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 2px 10px rgba(16,18,19,0.2)} 50%{box-shadow:0 4px 24px rgba(191,155,48,0.5)} } @keyframes glideup { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
`

function getLabel(s: number) { return s>=66?"High Readiness":s>=31?"Moderate Readiness":"Low Readiness" }
function getMeans(s: number) {
  if (s>=66) return "Your case is well-positioned for ATO negotiation. Strong compliance indicators and financial stability give you a solid foundation for a successful outcome."
  if (s>=31) return "Based on your responses, your case has a moderate likelihood of successful negotiation. Strengthening your compliance position and documenting financial stability will significantly improve your outcomes."
  return "Your case faces significant challenges in ATO negotiation. Immediate specialist advice is recommended before engaging the ATO directly."
}

function ScoreCounter({ target }: { target: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let v = 0
    const step = Math.max(1, Math.ceil(target/45))
    const t = setInterval(() => { v+=step; if(v>=target){setN(target);clearInterval(t)}else setN(v) }, 12)
    return () => clearInterval(t)
  }, [target])
  return <>{n}</>
}

function MicButton({ micState, onToggle }: { micState: string; onToggle: () => void }) {
  const active = micState === "listening"
  const processing = micState === "processing"
  const confirmed = micState === "confirmed"
  const unsure = micState === "unsure"
  return (
    <div onClick={onToggle} style={{position:"relative",width:"110px",height:"110px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",userSelect:"none"}}>
      <div style={{position:"absolute",inset:"-16px",borderRadius:"50%",background:"rgba(16,18,19,0.05)",animation:active?"pulseouter 1s ease-out infinite 0.3s":"pulseouter 3s ease-out infinite 0.6s",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:"0",borderRadius:"50%",background:"rgba(184,151,58,0.07)",animation:active?"pulsefast 1s ease-out infinite":"pulseslow 3s ease-out infinite",pointerEvents:"none"}}/>
      <div style={{width:"86px",height:"86px",borderRadius:"50%",background:confirmed?"linear-gradient(150deg,#2D6B3F,#1A4028)":unsure?"linear-gradient(150deg,#B8860B,#8B6508)":`linear-gradient(150deg,${CHARCOAL2},${CHARCOAL})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:active?`0 8px 28px rgba(16,18,19,0.4),0 0 0 2px rgba(184,151,58,0.2)`:"0 4px 18px rgba(16,18,19,0.28)",transition:"all 0.25s ease",transform:processing?"scale(0.95)":active?"scale(1.03)":"scale(1)"}}>
        {active
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill={GOLD}><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>
          : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>
        }
      </div>
    </div>
  )
}

export default function Page009() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string,string>>({})
  const [selected, setSelected] = useState("")
  const selectedRef = useRef("")
  const [flashed, setFlashed] = useState("")
  const [fading, setFading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string|null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)

  useEffect(() => { selectedRef.current = selected }, [selected])

  const q = QUESTIONS[current]
  const progress = Math.round((current/QUESTIONS.length)*100)

  const goNext = useCallback(() => {
    if (!selectedRef.current) return
    const ans = selectedRef.current
    const na = { ...answers, [QUESTIONS[current].id]: ans }
    setAnswers(na)
    setSelected("")
    selectedRef.current = ""
    setFlashed("")
    if (current < QUESTIONS.length-1) {
      setFading(true)
      setTimeout(() => { setCurrent(c => c+1); setFading(false) }, 320)
    } else { submit(na) }
  }, [answers, current])

  const goBack = useCallback(() => {
    if (current===0) return
    setFading(true)
    setTimeout(() => {
      setCurrent(c => {
        const prev = c-1
        setSelected(answers[QUESTIONS[prev].id]||"")
        selectedRef.current = answers[QUESTIONS[prev].id]||""
        return prev
      })
      setFading(false)
    }, 320)
  }, [current, answers])

  const handleSelect = useCallback((opt: string) => {
    setSelected(opt)
    selectedRef.current = opt
    setFlashed(opt)
    setTimeout(() => setFlashed(""), 180)
  }, [])

  const { micState, transcript, suggestion, toggle, activate, confirmSuggestion, dismissSuggestion } = useVoiceSessionV2({
    options: q.options,
    onSelect: handleSelect,
    onNext: current < QUESTIONS.length-1 ? goNext : () => {},
    onBack: goBack,
    stepIndex: current,
  })

  const submit = (fa: Record<string,string>) => {
    if (micState !== "idle") toggle()
    setLoading(true); setError(null)
    const data = calculateScoreLocal(fa)
    if (data.success) { setResult(data); window.scrollTo({top:0,behavior:"smooth"}) }
    else { setError(data.error || "Scoring failed") }
    setLoading(false)
  }

  const micLabel = () => {
    if (micState === "listening") return "Listening..."
    if (micState === "confirmed") return "✓ Got it — moving on..."
    if (micState === "unsure") return "Did you mean that? Say yes or tap to confirm"
    if (micState === "error") return transcript || "Didn't catch that — try again"
    if (micState==="processing") return "Matching..."
    if (micState==="paused") return "Tap to resume"
    if (transcript) return `"${transcript}"`
    return "Speak your answer"
  }

  if (loading) return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",background:OFF_WHITE}}>
      <style>{STYLES}</style>
      <div style={{textAlign:"center"}}>
        <div style={{width:"68px",height:"68px",borderRadius:"50%",background:confirmed?"linear-gradient(150deg,#2D6B3F,#1A4028)":unsure?"linear-gradient(150deg,#B8860B,#8B6508)":`linear-gradient(150deg,${CHARCOAL2},${CHARCOAL})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:"0 4px 18px rgba(16,18,19,0.28)"}}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>
        </div>
        <p style={{color:CHARCOAL,fontSize:"0.9rem",fontWeight:500,marginBottom:"4px"}}>Preparing your readiness report...</p>
        <p style={{color:MUTED,fontSize:"0.78rem"}}>Analysing case signals</p>
      </div>
    </div>
  )

  if (result) return (
    <div style={{minHeight:"80vh",background:OFF_WHITE,padding:"48px 24px",animation:"glideup 0.4s ease"}}>
      <style>{STYLES}</style>
      <div style={{maxWidth:"640px",margin:"0 auto",background:WHITE,borderRadius:"16px",border:`1px solid ${BORDER}`,padding:"48px 40px",boxShadow:"0 2px 24px rgba(0,0,0,0.05)"}}>
        <p style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.16em",color:GOLD,textAlign:"center",marginBottom:"28px",textTransform:"uppercase"}}>Negotiation Readiness Summary</p>
        <h2 style={{fontSize:"1.9rem",fontWeight:700,color:CHARCOAL,textAlign:"center",marginBottom:"6px"}}>{getLabel(result.score)}</h2>
        <p style={{textAlign:"center",marginBottom:"32px"}}>
          <span style={{fontSize:"1.15rem",fontWeight:600,color:GOLD}}><ScoreCounter target={result.score}/></span>
          <span style={{fontSize:"1rem",color:MUTED,fontWeight:400}}> / 100</span>
        </p>
        <hr style={{border:"none",borderTop:`1px solid ${BORDER}`,marginBottom:"28px"}}/>
        <h3 style={{fontSize:"0.82rem",fontWeight:700,color:CHARCOAL,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"0.06em"}}>What this means</h3>
        <p style={{fontSize:"0.875rem",color:"#4A4845",lineHeight:1.8,marginBottom:"32px"}}>{getMeans(result.score)}</p>
        {result.immediateActions?.length>0&&(
          <div style={{marginBottom:"28px"}}>
            <div style={{background:OFF_WHITE,borderRadius:"12px",padding:"20px",border:`1px solid ${BORDER}`}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
                <span style={{color:GOLD,fontSize:"0.75rem",fontWeight:700}}>&#10003;</span>
                <span style={{fontSize:"0.72rem",fontWeight:700,color:CHARCOAL,textTransform:"uppercase",letterSpacing:"0.06em"}}>Priority Improvements</span>
              </div>
              {result.immediateActions.map((a:string,i:number)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:WHITE,borderRadius:"8px",padding:"12px 16px",marginBottom:"8px",border:`1px solid ${BORDER}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"20px",height:"20px",borderRadius:"50%",background:CHARCOAL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{color:WHITE,fontSize:"0.6rem",fontWeight:700}}>&#10003;</span>
                    </div>
                    <span style={{fontSize:"0.83rem",color:CHARCOAL}}>{a}</span>
                  </div>
                  <span style={{color:MUTED}}>&#8250;</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {result.strengths?.length>0&&(
          <div style={{marginBottom:"36px"}}>
            <h3 style={{fontSize:"0.72rem",fontWeight:700,color:CHARCOAL,marginBottom:"14px",textTransform:"uppercase",letterSpacing:"0.06em"}}>What strengthens your case</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              {result.strengths.map((s:string,i:number)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"8px"}}>
                  <span style={{color:GOLD,fontSize:"0.65rem",marginTop:"4px",flexShrink:0}}>&#8226;</span>
                  <span style={{fontSize:"0.8rem",color:"#4A4845",lineHeight:1.6}}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {result.actions?.length>0&&(
          <div style={{marginBottom:"36px"}}>
            <h3 style={{fontSize:"0.72rem",fontWeight:700,color:"#8B2020",marginBottom:"14px",textTransform:"uppercase",letterSpacing:"0.06em"}}>Immediate Actions</h3>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {result.actions.map((a:string,i:number)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"10px 14px",borderRadius:"8px",background:"#FDF5F5",border:"1px solid #E8D5D5"}}>
                  <span style={{color:"#8B2020",fontSize:"0.7rem",marginTop:"2px",flexShrink:0}}>&#9888;</span>
                  <span style={{fontSize:"0.8rem",color:"#4A4845",lineHeight:1.6}}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button style={{width:"100%",background:CHARCOAL,color:WHITE,border:"none",borderRadius:"10px",padding:"16px",fontSize:"0.875rem",fontWeight:600,cursor:"pointer",letterSpacing:"0.03em",boxShadow:"0 2px 12px rgba(16,18,19,0.22)"}}>
          Book Strategy Call to Improve Readiness &#8250;
        </button>
        <div style={{textAlign:"center",marginTop:"16px"}}>
          <button onClick={()=>{setResult(null);setCurrent(0);setAnswers({});setSelected("");selectedRef.current="";setSessionStarted(false)}}
            style={{background:"none",border:"none",color:MUTED,fontSize:"0.78rem",cursor:"pointer",textDecoration:"underline"}}>
            &#8592; Start over
          </button>
        </div>
      </div>
    </div>
  )

  if (!sessionStarted) return (
    <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:OFF_WHITE}}>
      <style>{STYLES}</style>
      <div style={{textAlign:"center",maxWidth:"420px",padding:"40px 24px"}}>
        <p style={{fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.16em",color:GOLD,marginBottom:"20px",textTransform:"uppercase"}}>Appointment Preparation</p>
        <h2 style={{fontSize:"1.6rem",fontWeight:600,color:CHARCOAL,marginBottom:"12px",lineHeight:1.3}}>Negotiation Readiness Session</h2>
        <p style={{fontSize:"0.875rem",color:MUTED,lineHeight:1.7,marginBottom:"36px"}}>15 guided questions. Speak your answers or tap the cards. Your microphone will stay active throughout the session.</p>
        <button
          onClick={()=>{ setSessionStarted(true); setTimeout(()=>activate(),300) }}
          style={{display:"inline-flex",alignItems:"center",gap:"12px",background:CHARCOAL,color:WHITE,border:"none",borderRadius:"12px",padding:"16px 32px",fontSize:"0.9rem",fontWeight:600,cursor:"pointer",boxShadow:"0 4px 16px rgba(16,18,19,0.25)",fontFamily:FONT}}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/>
          </svg>
          Begin Session
        </button>
        <p style={{fontSize:"0.72rem",color:MUTED,marginTop:"16px"}}>Microphone access required — Chrome recommended</p>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",background:OFF_WHITE}}>
      <style>{STYLES}</style>
      <div style={{width:"100%",height:"2px",background:BORDER}}>
        <div style={{height:"2px",background:GOLD,width:`${progress}%`,transition:"width 0.5s ease",borderRadius:"1px",opacity:0.8}}></div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",opacity:fading?0:1,transform:fading?"translateY(16px)":"translateY(0)",transition:"opacity 0.32s ease,transform 0.32s ease"}}>
        <p style={{fontSize:"0.68rem",fontWeight:500,letterSpacing:"0.1em",color:MUTED,marginBottom:"16px",textAlign:"center"}}>
          {current+1} OF <span style={{color:CHARCOAL,fontWeight:700}}>{QUESTIONS.length}</span>
        </p>
        <h2 style={{fontSize:"1.45rem",fontWeight:600,color:CHARCOAL,marginBottom:"8px",textAlign:"center",maxWidth:"460px",lineHeight:1.35}}>{q.label}</h2>
        <div style={{width:"36px",height:"2px",background:GOLD,borderRadius:"1px",marginBottom:"28px",opacity:0.5}}></div>
        <p style={{fontSize:"0.75rem",color:MUTED,marginBottom:"14px",textAlign:"center"}}>Tap and speak your answer...</p>
        <div style={{background:WHITE,borderRadius:"16px",padding:"28px 24px",width:"100%",maxWidth:"540px",boxShadow:"0 2px 18px rgba(0,0,0,0.05)",border:`1px solid ${BORDER}`}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:"22px"}}>
            <MicButton micState={micState} onToggle={toggle}/>
            <p style={{fontSize:"0.74rem",color:micState==="listening"?GOLD:micState==="confirmed"?"#2D6B3F":micState==="unsure"?"#B8860B":micState==="error"?"#8B2020":MUTED,marginTop:"10px",minHeight:"18px",fontStyle:"italic",transition:"color 0.2s",textAlign:"center"}}>{micLabel()}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"20px"}}>
            {q.options.map((opt:string)=>(
              <button key={opt} onClick={()=>handleSelect(opt)} style={{padding:"13px 14px",borderRadius:"9px",border:selected===opt?"1.5px solid #2E3235":"1.5px solid #E4E2DD",background:flashed===opt?GOLD_BG:selected===opt?"#F4F3F1":WHITE,color:CHARCOAL,fontWeight:selected===opt?600:400,fontSize:"0.82rem",cursor:"pointer",transition:"all 0.15s ease",fontFamily:FONT,textAlign:"left",boxShadow:selected===opt?"0 2px 8px rgba(16,18,19,0.08)":"none",transform:flashed===opt?"scale(1.02)":"scale(1)"}}>
                {opt}
              </button>
            ))}
          </div>
          {micState === "unsure" && suggestion && (
            <div style={{marginBottom:"14px",padding:"12px 16px",borderRadius:"10px",border:"1.5px solid #B8860B",background:"#FDF8EF",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:"0.82rem",color:CHARCOAL}}>Did you mean: <b>{suggestion}</b>?</span>
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={dismissSuggestion} style={{padding:"7px 14px",borderRadius:"8px",border:`1.5px solid ${BORDER}`,background:"transparent",color:MUTED,fontSize:"0.76rem",cursor:"pointer",fontFamily:FONT,fontWeight:500}}>No</button>
                <button onClick={confirmSuggestion} style={{padding:"7px 14px",borderRadius:"8px",border:"none",background:CHARCOAL,color:WHITE,fontSize:"0.76rem",cursor:"pointer",fontFamily:FONT,fontWeight:600}}>Yes ✓</button>
              </div>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button onClick={goBack} disabled={current===0} style={{padding:"10px 18px",borderRadius:"8px",border:`1.5px solid ${BORDER}`,background:"transparent",color:current===0?BORDER:CHARCOAL,fontSize:"0.78rem",cursor:current===0?"default":"pointer",fontFamily:FONT,fontWeight:500}}>&#8592; Back</button>
            <button onClick={goNext} disabled={!selected} style={{padding:"11px 26px",background:selected?"#4A4D50":BORDER,color:selected?WHITE:MUTED,border:"none",borderRadius:"9px",fontSize:"0.83rem",fontWeight:600,cursor:selected?"pointer":"not-allowed",fontFamily:FONT,transition:"all 0.2s",boxShadow:selected?"0 2px 10px rgba(16,18,19,0.2)":"none",animation:selected&&current===QUESTIONS.length-1?"pulseGlow 2s ease-in-out infinite":"none"}}>
              {current===QUESTIONS.length-1?"Generate Assessment":"Next"} &#8594;
            </button>
          </div>
        </div>
        {error&&<p style={{color:"#8B2020",fontSize:"0.78rem",marginTop:"12px"}}>{error}</p>}
      </div>
    </div>
  )
}
