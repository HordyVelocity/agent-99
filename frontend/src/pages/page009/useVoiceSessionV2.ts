/**
 * ASCEND / AGENT99 — Voice Session V2
 * ═════════════════════════════════════
 * 
 * White-glove conversational voice engine
 * 7-state machine with confidence-gated routing
 * 
 * States: idle → listening → processing → confirmed/unsure/error → (auto-restart)
 * 
 * Matching layers (in order):
 *   1. Command detection (next/back/yes/no/change)
 *   2. Direct exact match against options
 *   3. Alias match (~240 Australian tax phrases)
 *   4. Semantic match via Claude Haiku (fallback)
 * 
 * Confidence routing:
 *   Deterministic match → CONFIRMED → auto-advance (always, regardless of confidence)
 *   Semantic + ≥ 0.40 → CONFIRMED → auto-advance
 *   Semantic + 0.35–0.39 → UNSURE → "Did you mean?" → wait for confirmation
 *   Semantic + < 0.35 → UNSURE → suggestion
 *   No match → ERROR → keep listening
 * 
 * Date: 23 Feb 2026
 * Author: Claude (Lead Dev)
 * Changes: deterministic auto-advance, remove Yes- prefixes, Lockdown DPN rename,
 *          Q11 format, Q4 ato aliases, matchSource logging
 */

import { useState, useRef, useCallback, useEffect } from "react"
import type { MicState, VoiceTiming } from "./voiceTypes"

// ── TIMING CONFIG ──
// Centralised — tune here, applies everywhere
const TIMING: VoiceTiming = {
  autoAdvanceMs:       1200,   // Confirmed → auto-next delay
  silenceMs:           6000,   // Silence before pause state
  resumeDelayMs:       2000,   // Pause → auto-resume delay
  restartAfterMatchMs:  150,   // Restart listening after confirmed match
  restartAfterFailMs:   250,   // Restart listening after no-match
  restartAfterErrorMs:  500,   // Restart listening after error
  stepTransitionMs:     200,   // Delay when question changes
  confidenceConfirmed:  0.40,  // Auto-advance threshold (semantic only)
  confidenceUnsure:     0.35,  // "Did you mean?" threshold (semantic only)
}

// ── VOICE COMMAND LISTS ──
const NEXT_WORDS = [
  "next","continue","proceed","done","move on","go ahead","next one",
  "move forward","confirm","okay","advance","forward","go next",
  "next question","yep next","yes next"
]
const BACK_WORDS = [
  "back","previous","go back","last question","previous question","go back one"
]
const YES_WORDS = [
  "yes","yep","yeah","correct","that's right","right","affirmative",
  "that's it","that one","yep that's right","yes that's right"
]
const NO_WORDS = [
  "no","nope","nah","wrong","change","actually","wait","hang on",
  "different","no wait","change that","change my answer","reselect","not that"
]

// ── ALIAS MAP ──
// ~240 Australian tax/colloquial phrases mapped to exact option text
const ALIASES: Record<string, string[]> = {
  // Q1: Business structure
  "Individual / Sole Trader": ["individual","sole trader","sole","soul trader","salt trader","so trader","so ill trader","sole business","sole trade","im a sole trader","i am a sole trader","sole proprietor","self employed","self-employed"],
  "Company": ["company","pty ltd","pty","proprietary","corporation","corp","companies","i have a company","my company","limited company"],
  "Trust": ["trust","family trust","unit trust","discretionary trust","trust structure"],
  "Partnership": ["partnership","partner","partners","business partner","business partners"],
  // Q2: ATO debt amount
  "$15,000 to $250,000": ["fifteen thousand","under 250","less than 250","small debt","manageable","15 to 250","under 250 thousand","under two fifty","hundred thousand","about 100","about 50","fifty thousand"],
  "$250,000 to $500,000": ["250 to 500","two fifty to five hundred","quarter million","half a million","250 thousand","between 250 and 500","about 300","about 400","three hundred thousand","four hundred thousand"],
  "$500,000 to $1,000,000": ["500 to a million","five hundred thousand","half a million to a million","large debt","significant debt","500 thousand","over 500","about 700","about 800","seven hundred thousand","eight hundred thousand"],
  "$1,000,000+": ["over a million","over one million","above one million","more than one million","million plus","millions","huge debt","massive debt","very large","major debt","multi million","several million","two million","three million"],
  // Q3: How long outstanding
  "Less than 6 months": ["less than 6 months","under 6 months","under six months","less than six","recent","new debt","just started","few months","couple months","couple of months","a month","two months","three months"],
  "6 to 12 months": ["6 to 12 months","six to twelve months","half a year","about a year","six months to a year","around a year","half year","9 months","nine months","10 months","eleven months"],
  "More than 2 years": ["more than 2 years","over two years","over 2 years","more than two years","several years","long standing","many years","3 years","4 years","5 years","ages"],
  // Q4: ATO notices
  "None": ["none","nothing","no notices","haven't received","no letters","no notice","haven't had any","i haven't received any","not yet","nothing yet","no not yet"],
  "Overdue notice": ["overdue","overdue notice","payment overdue","late notice","late payment"],
  "ATO Garnishee": ["garnishee","garnish","garnishing","garnishing notice","garnish she","gana she","bank garnishee","they garnished","garnished my account","frozen account","account frozen","ato","ato garnishee","tax office","tax office garnishee"],
  "Statutory demand": ["statutory","statutory demand","formal demand","section 459","strategy","strategy remained","strategy demand"],
  "Wind-up notice": ["wind up","winding up","wind-up","closure notice","windup","winding up notice"],
  "Bankruptcy notice": ["bankruptcy","bankrupt","bankruptcy notice","insolvency notice","insolvency"],
  // Q5: BAS returns (renamed: removed "Yes - " prefix)
  "All current": ["all current","yes all current","fully lodged","all up to date","yes current","up to date","all done","completely current","all lodged and current","yes they are","yeah all current","yeah up to date"],
  "Mostly current": ["mostly","mostly current","almost current","nearly current","mostly done","pretty much","mostly yes","almost"],
  "Partially lodged": ["partial","partially","some lodged","partially lodged","some done","mixed","half done","some of them"],
  "Not current": ["not current","behind","not lodged","outstanding","not done","overdue lodgements","way behind","haven't done them","nah"],
  // Q6: Income tax returns
  "Lodgements up to date": ["lodgements up to date","up to date","all lodged","fully lodged","all done","all up to date","current","all filed","complete","yep all done","yes all lodged","fully lodged","all done","all up to date","current","all filed","complete","yep all done","yes all lodged"],
  "Minor arrears": ["minor arrears","minor","small arrears","small","slightly behind","one or two years","a little behind","minor behind","just a bit","small","minor","minor arrears","small arrears","slightly behind","one or two years","a little behind","minor behind","just a bit"],
  "Major arrears": ["major arrears","major","significant arrears","significant","large arrears","large","multiple years","several behind","quite behind","really behind","very behind"],
  "Never lodged": ["never","never lodged","not filed","none lodged","never done","haven't ever","never have"],
  // Q7: Payment plan history (renamed: removed "Yes - " prefix)
  "No": ["no","nope","negative","no i haven't","have not","no i have not","haven't","i don't","i do not","no i don't","nah","nope never"],
  "Successful": ["successful","yes successful","worked","yes it worked","previous plan worked","was successful","it worked","they accepted it","had a successful one"],
  "Defaulted": ["defaulted","fulton","faulted","default","yes defaulted","broke the plan","failed plan","yes failed","did default","couldn't keep up","fell behind on it","defaulted on it"],
  "Attempted - rejected": ["rejected","was rejected","they said no","rejected attempt","denied","turned down","they wouldn't accept","they refused"],
  // Q8: Director
  "Yes": ["yes","yep","correct","that's right","affirmative","i am","yes i am","i do","yeah","yep that's right","yeah i am","that's me"],
  "Recently resigned": ["recently resigned","just resigned","resigned recently","stepped down recently","just stepped down","resigned last month","recently stepped down"],
  // Q9: DPN (renamed: "Yes - lockdown" → "Lockdown DPN", "Yes - non-lockdown" → "Non-lockdown DPN")
  "Lockdown DPN": ["lockdown","lockdown dpn","locked down dpn","locked dpn","lockdown one","the lockdown one","yes lockdown"],
  "Non-lockdown DPN": ["non lockdown","non-lockdown","not lockdown","non lockdown dpn","non-lockdown dpn","unlocked dpn","the other one","non lockdown one","yes non lockdown"],
  "Unsure": ["unsure","not sure","don't know","uncertain","maybe","possibly","not certain","no idea","i'm not sure","i am not sure","what's that","what is that","don't understand"],
  // Q10: Personal liabilities
  "Small amount": ["small amount","small","minor","small","not much","minimal","little bit","not a lot","minor amount","a little","just a bit"],
  "Significant": ["significant","substantial","considerable","quite a lot","a lot","significant amount","heaps","plenty"],
  "Major liabilities": ["major liabilities","major","liabilities","major liability","overwhelming","too much","can't cope","massive","enormous","crushing","overwhelmed","it's overwhelming","drowning","buried"],
  // Q11: Monthly contribution (renamed: hyphen → "to")
  "Under $500": ["under 500","less than 500","under five hundred","not much","small amount","minimal","under 500 dollars","a few hundred","couple hundred"],
  "$500 to $1,500": ["500 to 1500","five hundred to fifteen hundred","around a thousand","about 1000","thousand","about a thousand","a grand","about a grand"],
  "$1,500 to $3,000": ["1500 to 3000","fifteen hundred to three thousand","couple thousand","about 2000","two thousand","about two grand","couple grand"],
  "Over $3,000": ["over 3000","more than 3000","over three thousand","three thousand plus","more than three","5000","4000","five thousand","ten thousand","over three grand","above 3000","3000 plus","over 3"],
  // Q12: Payment timeframe
  "Less than a year": ["less than a year","under a year","under 12","less than 12","under a year","short term","quick","within a year","under twelve months","as fast as possible","quickly"],
  "1 to 2 years": ["1 to 2 years","one to two years","one or two years","about a year","year and a half","18 months","eighteen months","about two years","12 to 24","year or two","12 24","a couple of years"],
  "2 to 3 years": ["2 to 3 years","two to three years","24 to 36","two to three years","couple of years","two three years","thirty months","24 36","about three years"],
  "Over 3 years": ["over 3 years","over three years","over 36","more than 3 years","long term","three years plus","long plan","extended","over 3 years","as long as possible","maximum time"],
  // Q13: Business income stability
  "Growing": ["growing","growth","increasing","going up","expanding","good","improving","business is growing","getting better","on the up"],
  "Stable": ["stable","steady","consistent","same","holding","neutral","flat","staying the same","not changing"],
  "Declining": ["declining","going down","decreasing","less revenue","falling","worse","dropping","it's declining","getting worse","struggling"],
  "No income": ["no income","no revenue","nothing coming in","no money","stopped","closed","zero income","we have no income","nothing","zero"],
  // Q14: Primary goal
  "Keep business trading": ["keep trading","stay open","continue trading","keep operating","stay in business","keep going","i want to keep trading","keep it going","save the business"],
  "Negotiate debt reduction": ["reduce debt","debt reduction","negotiate reduction","lower the debt","settle for less","reduce the amount","negotiate","negotiate debt","get a reduction","pay less","reduce"],
  "Wind down responsibly": ["wind down","close responsibly","shut down","wind up","close business","orderly closure","wind it down","responsibly wind down","close it down"],
  "Avoid bankruptcy": ["avoid bankruptcy","not go bankrupt","stay out of bankruptcy","prevent bankruptcy","no bankruptcy","avoid going bankrupt","don't want bankruptcy","scared of bankruptcy"],
  // Q15: Urgency
  "Planning ahead": ["planning ahead","early stages","just planning","proactive","not urgent","being prepared","just planning ahead","thinking ahead","getting prepared","preparation"],
  "Moderate urgency": ["moderate","somewhat urgent","fairly urgent","moderate urgency","getting urgent","reasonably urgent","kind of urgent","becoming urgent"],
  "Very urgent": ["very urgent","high urgency","urgent","hi agency","hi hennessey","hi hennessy","hi urgency","very urgent","need help soon","pressing","quite urgent","high","really urgent","need help now"],
  "ATO Action": ["ato action","critical","threatening","ato threatening","legal action","very urgent","emergency","crisis","imminent","ato is threatening","they are threatening","they're going to","court","tribunal","enforcement"],
}


// ── MATCHING FUNCTIONS (module scope — not recreated per render) ──

function matchCommand(spoken: string): { type: "next"|"back"|"yes"|"no"|"change" } | null {
  const s = spoken.toLowerCase().trim()
  if (NEXT_WORDS.some(w => s === w)) return { type: "next" }
  if (BACK_WORDS.some(w => s === w)) return { type: "back" }
  if (YES_WORDS.some(w => s === w)) return { type: "yes" }
  if (NO_WORDS.some(w => s === w)) return { type: "no" }
  return null
}



function hasPhrase(s: string, phrase: string) {
  const hay = ` ${s.toLowerCase().trim()} `
  const needle = ` ${phrase.toLowerCase().trim()} `
  return hay.includes(needle)
}

function matchOption(spoken: string, options: string[]): string | null {
  const s = spoken.toLowerCase().trim()
  // 1. Exact match
  const exact = options.find(o => o.toLowerCase() === s)
  if (exact) return exact
  // 2. Alias match (longest phrase wins)
  let bestMatch: { opt: string; len: number } | null = null
  for (const opt of options) {
    const aliases = ALIASES[opt] || []
    for (const a of aliases) {
      if (s === a || hasPhrase(s, a)) {
        const len = a.length
        if (!bestMatch || len > bestMatch.len) bestMatch = { opt, len }
      }
    }
  }
  if (bestMatch) return bestMatch.opt
  // 3. Keyword match (unique words > 4 chars only)
  for (const opt of options) {
    const words = opt.toLowerCase().split(/[\s\-$,]+/).filter(w => w.length > 4)
    const uniqueWords = words.filter(w => {
      const otherOpts = options.filter(o => o !== opt)
      return !otherOpts.some(o => o.toLowerCase().includes(w))
    })
    if (uniqueWords.some(w => s.includes(w))) return opt
  }
  return null
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
        system: "You are a voice recognition matcher for an Australian tax debt assessment tool. The user is answering questions about their ATO debt situation. Reply with ONLY the exact option text from the list provided. No quotes, no punctuation, no explanation. If nothing matches, reply NULL.",
        messages: [{ role: "user", content: "Options: " + JSON.stringify(options) + "\nUser said: \"" + spoken + "\"\nBest matching option:" }]
      })
    })
    const data = await response.json()
    const result = data.content?.[0]?.text?.trim().replace(/^["']|["']$/g, "").trim()
    if (!result || result === "NULL" || result.toUpperCase() === "NULL") return null
    const exact = options.find(o => o.toLowerCase() === result.toLowerCase())
    return exact || null
  } catch { return null }
}


// ── HOOK INTERFACE ──

interface Opts {
  options: string[]
  onSelect: (o: string) => void
  onNext: () => void
  onBack: () => void
  stepIndex: number
}

export function useVoiceSessionV2({ options, onSelect, onNext, onBack, stepIndex }: Opts) {
  const [micState, setMicState] = useState<MicState>("idle")
  const [transcript, setTranscript] = useState("")
  const [suggestion, setSuggestion] = useState<string | null>(null)

  const active = useRef(false)
  const rec = useRef<any>(null)
  const silTimer = useRef<any>(null)
  const autoAdvTimer = useRef<any>(null)

  // Stable refs for callbacks (avoids stale closures)
  const optsRef = useRef(options)
  const cbNext = useRef(onNext)
  const cbBack = useRef(onBack)
  const cbSel = useRef(onSelect)
  useEffect(() => { optsRef.current = options }, [options])
  useEffect(() => { cbNext.current = onNext }, [onNext])
  useEffect(() => { cbBack.current = onBack }, [onBack])
  useEffect(() => { cbSel.current = onSelect }, [onSelect])

  // ── TIMER HELPERS ──
  const clearSil = () => { if (silTimer.current) clearTimeout(silTimer.current); silTimer.current = null }
  const clearAdv = () => { if (autoAdvTimer.current) clearTimeout(autoAdvTimer.current); autoAdvTimer.current = null }

  // ── STOP ──
  const stop = useCallback(() => {
    active.current = false
    clearSil()
    clearAdv()
    if (rec.current) { try { rec.current.abort() } catch {} rec.current = null }
    setMicState("idle")
  }, [])

  // ── START RECOGNITION ──
  const start = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setMicState("error")
      setTranscript("Voice not supported in this browser")
      return
    }
    if (rec.current) { try { rec.current.abort() } catch {} rec.current = null }
    clearSil()

    const r = new SR()
    r.lang = "en-AU"
    r.continuous = true
    r.interimResults = true
    r.maxAlternatives = 3
    rec.current = r
    setMicState("listening")

    // Silence timeout → pause
    silTimer.current = setTimeout(() => {
      if (active.current) {
        setMicState("paused")
        try { r.abort() } catch {}
        setTimeout(() => {
          if (active.current) { setMicState("listening"); start() }
        }, TIMING.resumeDelayMs)
      }
    }, TIMING.silenceMs)

    // ── ON RESULT ──
    r.onresult = async (e: any) => {
      if (!e.results[0].isFinal) return  // Skip interim results
      clearSil()
      const alternatives = Array.from(e.results[0]).map((alt: any) => alt.transcript.toLowerCase().trim())
      const webConfidence: number = e.results[0][0].confidence
      const spoken = alternatives[0]
      setTranscript(spoken)
      console.log("🎤 VOICE DEBUG:", { spoken, alternatives, webConfidence, questionIndex: stepIndex })

      // Skip very low confidence entirely
      if (webConfidence < 0.15) {
        setMicState("error")
        if (active.current) setTimeout(() => { if (active.current) start() }, TIMING.restartAfterFailMs)
        return
      }

      setMicState("processing")

      // ── LAYER 1: COMMANDS ──
      const cmd = matchCommand(spoken)
      // If "no"/"yes" is a valid answer option, try option match FIRST
      const noIsOption = optsRef.current.some(o => o.toLowerCase() === "no")
      const yesIsOption = optsRef.current.some(o => o.toLowerCase().startsWith("yes"))
      if (cmd && !((cmd.type === "no" && noIsOption) || (cmd.type === "yes" && yesIsOption && !suggestion))) {
        clearAdv()
        if (cmd.type === "next") { cbNext.current(); autoRestart(); return }
        if (cmd.type === "back") { cbBack.current(); autoRestart(); return }
        if (cmd.type === "yes" && suggestion) {
          // Confirm the pending suggestion
          cbSel.current(suggestion)
          setSuggestion(null)
          setMicState("confirmed")
          autoAdvTimer.current = setTimeout(() => {
            if (active.current) cbNext.current()
          }, TIMING.autoAdvanceMs)
          autoRestart()
          return
        }
        if (cmd.type === "no" || cmd.type === "change") {
          // Cancel suggestion, keep listening
          setSuggestion(null)
          setMicState("listening")
          if (active.current) setTimeout(() => { if (active.current) start() }, TIMING.restartAfterFailMs)
          return
        }
      }

      // ── LAYER 2: DIRECT + ALIAS MATCH ──
      let matched: string | null = null
      let matchSource: "deterministic" | "semantic" | null = null

      // 1) Deterministic: spoken first
      matched = matchOption(spoken, optsRef.current)
      if (matched) matchSource = "deterministic"

      // 2) Deterministic: alternatives
      if (!matched) {
        for (const alt of alternatives) {
          matched = matchOption(alt, optsRef.current)
          if (matched) { matchSource = "deterministic"; break }
        }
      }

      // ── LAYER 3: SEMANTIC MATCH (Haiku fallback) ──
      if (!matched) {
        matched = await semanticMatch(spoken, optsRef.current)
        if (matched) matchSource = "semantic"
      }
      if (!matched) {
        for (const alt of alternatives.slice(1)) {
          matched = await semanticMatch(alt, optsRef.current)
          if (matched) { matchSource = "semantic"; break }
        }
      }

      console.log("🎯 MATCH RESULT:", { matched, matchSource, webConfidence, spoken, options: optsRef.current })
      // ── ROUTE BY CONFIDENCE ──
      if (matched) {
        cbSel.current(matched)

        if (matchSource === "deterministic" || webConfidence >= TIMING.confidenceConfirmed) {
          // ✅ DETERMINISTIC or HIGH CONFIDENCE → confirmed → auto-advance
          setSuggestion(null)
          setMicState("confirmed")
          clearAdv()
          autoAdvTimer.current = setTimeout(() => {
            if (active.current) cbNext.current()
          }, TIMING.autoAdvanceMs)
          autoRestart()
        } else if (webConfidence >= TIMING.confidenceUnsure) {
          // 🟡 SEMANTIC + MEDIUM CONFIDENCE → unsure → wait for confirmation
          setSuggestion(matched)
          setMicState("unsure")
          // Do NOT auto-advance — wait for "yes" command or tap
          autoRestart()
        } else {
          // 🔴 SEMANTIC + LOW CONFIDENCE — treat as unsure
          setSuggestion(matched)
          setMicState("unsure")
          autoRestart()
        }
      } else {
        // No match at all
        setSuggestion(null)
        setMicState("error")
        if (active.current) setTimeout(() => { if (active.current) start() }, TIMING.restartAfterFailMs)
      }
    }

    // ── ON ERROR ──
    r.onerror = (e: any) => {
      clearSil()
      if (e.error === "not-allowed") {
        active.current = false
        setMicState("idle")
        setTranscript("Microphone access denied")
        return
      }
      if (e.error === "aborted") return
      if (active.current) setTimeout(() => { if (active.current) start() }, TIMING.restartAfterErrorMs)
    }

    r.onend = () => {
      clearSil()
      // Auto-restart to keep mic hot (white-glove = continuous listening)
      if (active.current && rec.current === r) {
        setTimeout(() => { if (active.current) start() }, TIMING.restartAfterMatchMs)
      }
    }

    try { r.start() } catch {
      if (active.current) setTimeout(() => start(), TIMING.restartAfterErrorMs)
    }
  }, [])

  // Helper: restart listening after a short delay (keeps mic hot)
  const autoRestart = () => {
    setTimeout(() => { if (active.current) start() }, TIMING.restartAfterMatchMs)
  }

  // ── STEP CHANGE: reset state, keep listening ──
  useEffect(() => {
    setTranscript("")
    setSuggestion(null)
    clearAdv()
    if (active.current) setTimeout(() => { if (active.current) start() }, TIMING.stepTransitionMs)
  }, [stepIndex])

  // ── CLEANUP ──
  useEffect(() => () => stop(), [stop])

  // ── TOGGLE ──
  const toggle = useCallback(() => {
    if (micState === "listening" || micState === "confirmed" || micState === "processing" || micState === "unsure") {
      stop()
    } else {
      active.current = true
      start()
    }
  }, [micState, stop, start])
  // ── ACTIVATE (initial session start with Safari warmup) ──
  const activate = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { active.current = true; start(); return }
    const dummy = new SR()
    dummy.lang = "en-AU"
    dummy.continuous = false
    dummy.interimResults = false
    try { dummy.start() } catch {}
    setTimeout(() => {
      try { dummy.abort() } catch {}
      active.current = true
      start()
    }, 150)
  }, [start])

  // ── CONFIRM SUGGESTION (tap-to-confirm for unsure state) ──
  const confirmSuggestion = useCallback(() => {
    if (!suggestion) return
    cbSel.current(suggestion)
    setSuggestion(null)
    setMicState("confirmed")
    clearAdv()
    autoAdvTimer.current = setTimeout(() => {
      if (active.current) cbNext.current()
    }, TIMING.autoAdvanceMs)
  }, [suggestion])

  // ── DISMISS SUGGESTION (tap-to-reject for unsure state) ──
  const dismissSuggestion = useCallback(() => {
    setSuggestion(null)
    setMicState("listening")
    if (active.current) setTimeout(() => { if (active.current) start() }, TIMING.restartAfterFailMs)
  }, [start])

  return {
    micState,
    transcript,
    suggestion,
    toggle,
    activate,
    confirmSuggestion,
    dismissSuggestion,
    stop,
  }
}
