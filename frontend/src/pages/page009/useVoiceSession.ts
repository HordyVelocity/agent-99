import { useState, useRef, useCallback, useEffect } from "react"
export type MicState = "idle" | "listening" | "processing" | "confirmed" | "paused"
interface Opts {
  options: string[]
  onSelect: (o: string) => void
  onNext: () => void
  onBack: () => void
  stepIndex: number
}

const ALIASES: Record<string, string[]> = {
  "Sole Trader": ["sole trader","sole","soul trader","sole business","sole trade","im a sole trader","i am a sole trader"],
  "Company": ["company","pty ltd","pty","proprietary","corporation","corp","companies","i have a company"],
  "Trust": ["trust","family trust","unit trust","discretionary trust"],
  "Partnership": ["partnership","partner","partners"],
  "Under $10k": ["under 10","less than 10","under ten","below 10","small debt","ten thousand","under 10k","less than 10k","below 10k"],
  "$10k-$50k": ["10 to 50","ten to fifty","10k to 50k","between 10 and 50","fifty thousand","10 50","10k 50k","about 20","about 30","about 40"],
  "$50k-$200k": ["50 to 200","fifty to two hundred","50k to 200k","between 50 and 200","hundred thousand","150","100k","about 100","about 150"],
  "Over $200k": ["over 200","more than 200","above 200","200k plus","two hundred thousand","large debt","massive debt","over 200k"],
  "Under 6 months": ["under 6","less than 6","under six","recent","new debt","just started","few months","6 months","under six months","less than six months","only recent","just happened"],
  "6-12 months": ["6 to 12","six to twelve","half a year","about a year","six months","around a year","6 12","half year"],
  "1-2 years": ["1 to 2","one to two","one year","two years","a year or two","couple of years","year or two","about a year and a half","year and a half","18 months","eighteen months"],
  "Over 2 years": ["over 2","more than 2","over two","long time","several years","long standing","many years","over 2 years","more than two years","a few years","3 years","4 years","5 years"],
  "None": ["none","nothing","no notices","haven't received","no letters","no notice","haven't had any","i haven't received any"],
  "Overdue notice": ["overdue","overdue notice","payment overdue","late notice"],
  "Garnishee notice": ["garnishee","garnish","bank garnishee"],
  "Statutory demand": ["statutory","statutory demand","formal demand","section 459"],
  "Wind-up notice": ["wind up","winding up","wind-up","closure notice","windup"],
  "Bankruptcy notice": ["bankruptcy","bankrupt","bankruptcy notice","insolvency notice"],
  "Yes - all current": ["yes all current","all current","fully lodged","all up to date","yes current","up to date","all done","completely current","all lodged and current"],
  "Mostly current": ["mostly","mostly current","almost current","nearly current","mostly done"],
  "Partially lodged": ["partial","partially","some lodged","partially lodged","some done","mixed"],
  "Not current": ["not current","behind","not lodged","outstanding","not done","overdue lodgements","way behind"],
  "All lodged": ["all lodged","fully lodged","all done","all up to date","current","all filed","complete"],
  "Minor arrears": ["minor","minor arrears","small arrears","slightly behind","one or two years","a little behind","minor behind"],
  "Significant arrears": ["significant","significant arrears","multiple years","several behind","quite behind"],
  "Never lodged": ["never","never lodged","not filed","none lodged","never done"],
  "No": ["no","nope","negative","no i haven't","have not","no i have not","haven't","i don't","i do not","no i don't"],
  "Yes - successful": ["yes successful","successful","worked","yes it worked","previous plan worked","was successful"],
  "Yes - defaulted": ["defaulted","yes defaulted","broke the plan","failed plan","yes failed","did default"],
  "Attempted - rejected": ["rejected","was rejected","they said no","rejected attempt","denied","turned down"],
  "Yes": ["yes","yep","correct","that's right","affirmative","i am","yes i am","i do","yeah","yep that's right"],
  "Recently resigned": ["recently resigned","just resigned","resigned recently","stepped down recently","just stepped down"],
  "Yes - lockdown": ["lockdown","yes lockdown","locked down dpn","lockdown dpn","locked dpn"],
  "Yes - non-lockdown": ["non lockdown","non-lockdown","not lockdown","non lockdown dpn","unlocked dpn"],
  "Unsure": ["unsure","not sure","don't know","uncertain","maybe","possibly","not certain","no idea","i'm not sure","i am not sure"],
  "Minor": ["minor","small","not much","minimal","little bit","not a lot","minor amount"],
  "Significant": ["significant","substantial","major","considerable","quite a lot","a lot","significant amount"],
  "Overwhelming": ["overwhelming","too much","can't cope","massive","enormous","crushing","overwhelmed","it's overwhelming"],
  "Under $500": ["under 500","less than 500","under five hundred","not much","small amount","minimal","under 500 dollars"],
  "$500-$1,500": ["500 to 1500","five hundred to fifteen hundred","around a thousand","about 1000","thousand","about a thousand"],
  "$1,500-$3,000": ["1500 to 3000","fifteen hundred to three thousand","couple thousand","about 2000","two thousand"],
  "Over $3,000": ["over 3000","more than 3000","over three thousand","three thousand plus","more than three"],
  "Under 12 months": ["under 12","less than 12","under a year","short term","quick","within a year","under twelve months"],
  "12-24 months": ["12 to 24","one to two years","about two years","year or two","eighteen months","12 24"],
  "24-36 months": ["24 to 36","two to three years","couple of years","two three years","thirty months","24 36"],
  "Over 36 months": ["over 36","more than 3 years","long term","three years plus","long plan","extended","over 3 years"],
  "Growing": ["growing","growth","increasing","going up","expanding","good","improving","business is growing"],
  "Stable": ["stable","steady","consistent","same","holding","neutral","flat","staying the same"],
  "Declining": ["declining","going down","decreasing","less revenue","falling","worse","dropping","it's declining"],
  "No income": ["no income","no revenue","nothing coming in","no money","stopped","closed","zero income","we have no income"],
  "Keep business trading": ["keep trading","stay open","continue trading","keep operating","stay in business","keep going","i want to keep trading"],
  "Negotiate debt reduction": ["reduce debt","debt reduction","negotiate reduction","lower the debt","settle for less","reduce the amount","negotiate","negotiate debt","get a reduction"],
  "Wind down responsibly": ["wind down","close responsibly","shut down","wind up","close business","orderly closure","wind it down","responsibly wind down"],
  "Avoid bankruptcy": ["avoid bankruptcy","not go bankrupt","stay out of bankruptcy","prevent bankruptcy","no bankruptcy","avoid going bankrupt"],
  "Planning ahead": ["planning ahead","early stages","just planning","proactive","not urgent","being prepared","just planning ahead"],
  "Moderate urgency": ["moderate","somewhat urgent","fairly urgent","moderate urgency","getting urgent","reasonably urgent"],
  "High urgency": ["high urgency","urgent","very urgent","need help soon","pressing","quite urgent","fairly urgent","high"],
  "Critical - ATO threatening action": ["critical","threatening","ato threatening","legal action","very urgent","emergency","crisis","imminent","ato is threatening","they are threatening"],
}

async function semanticMatch(spoken: string, options: string[]): Promise<string | null> {
  try {
    const key = (import.meta as any).env.VITE_ANTHROPIC_KEY
    if (!key) return null
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 50,
        system: "You are a voice recognition matcher. Reply with ONLY the exact option text from the list provided. No quotes, no punctuation, no explanation. If nothing matches, reply NULL.",
        messages: [{ role: "user", content: "Options: " + JSON.stringify(options) + "\nUser said: \"" + spoken + "\"\nBest matching option:" }]
      })
    })
    const data = await response.json()
    const result = data.content?.[0]?.text?.trim().replace(/^["']|["']$/g, "").trim()
    if (!result || result === "NULL" || result.toUpperCase() === "NULL") return null
    const exact = options.find(o => o.toLowerCase() === result.toLowerCase())
    if (exact) return exact
    return options.find(o => o.toLowerCase().includes(result.toLowerCase()) || result.toLowerCase().includes(o.toLowerCase())) || null
  } catch { return null }
}

function matchOption(spoken: string, options: string[]): string | null {
  const s = spoken.toLowerCase().trim()
  const exact = options.find(o => o.toLowerCase() === s)
  if (exact) return exact
  for (const opt of options) {
    const aliases = ALIASES[opt] || []
    if (aliases.some(a => s === a || s.includes(a) || a.includes(s))) return opt
  }
  for (const opt of options) {
    const words = opt.toLowerCase().split(/[\s\-$,]+/).filter(w => w.length > 3)
    if (words.some(w => s.includes(w))) return opt
  }
  return null
}

export function useVoiceSession({ options, onSelect, onNext, onBack, stepIndex }: Opts) {
  const [micState, setMicState] = useState<MicState>("idle")
  const [transcript, setTranscript] = useState("")
  const active = useRef(false)
  const rec = useRef<any>(null)
  const sil = useRef<any>(null)
  const autoAdv = useRef<any>(null)
  const opts = useRef(options)
  const cbNext = useRef(onNext)
  const cbBack = useRef(onBack)
  const cbSel = useRef(onSelect)
  const stepRef = useRef(stepIndex)
  useEffect(() => { opts.current = options }, [options])
  useEffect(() => { stepRef.current = stepIndex }, [stepIndex])
  useEffect(() => { cbNext.current = onNext }, [onNext])
  useEffect(() => { cbBack.current = onBack }, [onBack])
  useEffect(() => { cbSel.current = onSelect }, [onSelect])
  const clearSil = () => { if (sil.current) clearTimeout(sil.current) }
  const clearAdv = () => { if (autoAdv.current) clearTimeout(autoAdv.current) }
  const stop = useCallback(() => {
    active.current = false
    clearSil()
    clearAdv()
    if (rec.current) { try { rec.current.abort() } catch {} rec.current = null }
    setMicState("idle")
  }, [])
  const start = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    if (rec.current) { try { rec.current.abort() } catch {} rec.current = null }
    clearSil()
    const r = new SR()
    r.lang = "en-AU"
    r.interimResults = false
    r.maxAlternatives = 3
    rec.current = r
    setMicState("listening")
    sil.current = setTimeout(() => {
      if (active.current) {
        setMicState("paused")
        try { r.abort() } catch {}
        setTimeout(() => { if (active.current) { setMicState("listening"); start() } }, 3000)
      }
    }, 8000)
    r.onresult = async (e: any) => {
      clearSil()
      const alternatives = Array.from(e.results[0]).map((alt: any) => alt.transcript.toLowerCase().trim())
      const confidence: number = e.results[0][0].confidence
      const s = alternatives[0]
      setTranscript(s)
      if (confidence < 0.45) {
        setMicState("listening")
        if (active.current) setTimeout(() => { if (active.current) start() }, 300)
        return
      }
      setMicState("processing")
      const nextWords = ["next","continue","proceed","done","move on","go ahead","next one","move forward","confirm","okay","advance","forward","go next","next question"]
      const backWords = ["back","previous","go back","last question","previous question"]
      const changeWords = ["change","different","actually","no wait","wrong","change that","change my answer","reselect"]
      if (nextWords.includes(s)) { clearAdv(); cbNext.current(); return }
      if (backWords.includes(s)) { clearAdv(); cbBack.current(); return }
      if (changeWords.some(w => s.includes(w))) {
        clearAdv()
        setMicState("listening")
        if (active.current) setTimeout(() => { if (active.current) start() }, 300)
        return
      }
      let m: string | null = null
      for (const alt of alternatives) {
        m = matchOption(alt, opts.current)
        if (m) break
      }
      if (!m) m = await semanticMatch(s, opts.current)
      if (!m) {
        for (const alt of alternatives.slice(1)) {
          m = await semanticMatch(alt, opts.current)
          if (m) break
        }
      }
      if (m) {
        cbSel.current(m)
        setMicState("confirmed")
        setTimeout(() => { if (active.current) start() }, 300)
        clearAdv()
        autoAdv.current = setTimeout(() => {
          if (active.current) cbNext.current()
        }, 2500)
      } else {
        setMicState("listening")
        if (active.current) setTimeout(() => { if (active.current) start() }, 500)
      }
    }
    r.onerror = (e: any) => {
      clearSil()
      if (e.error === "not-allowed") { active.current = false; setMicState("idle"); return }
      if (e.error === "aborted") return
      if (active.current) setTimeout(() => { if (active.current) start() }, 600)
    }
    r.onend = () => { clearSil() }
    try { r.start() } catch { if (active.current) setTimeout(() => start(), 500) }
  }, [])
  useEffect(() => {
    setTranscript("")
    clearAdv()
    if (active.current) setTimeout(() => { if (active.current) start() }, 400)
  }, [stepIndex])
  useEffect(() => () => stop(), [stop])
  const toggle = useCallback(() => {
    if (micState === "listening" || micState === "confirmed" || micState === "processing") { stop() }
    else { active.current = true; start() }
  }, [micState, stop, start])
  const activate = useCallback(() => { active.current = true; start() }, [start])
  return { micState, transcript, toggle, activate }
}
