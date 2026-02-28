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
  // DX-1: Primary goal
  "Negotiate ATO Debt / Avoid insolvency": ["negotiate","keep trading","stay open","continue trading","keep operating","stay in business","keep going","save the business","avoid insolvency","negotiate debt","reduce debt","settle","pay less","lower the debt","avoid bankruptcy","not go bankrupt"],
  "Wind down responsibly": ["wind down","close responsibly","shut down","wind up","close business","orderly closure","wind it down","close it down","responsibly"],
  // DX-2: Business structure
  "Individual": ["individual","myself","personal","me","just me","im an individual","i am an individual","personal capacity"],
  "Sole Trader": ["sole trader","sole","soul trader","sole proprietor","self employed","self-employed","sole business","sole trade","im a sole trader"],
  "Partnership": ["partnership","partner","partners","business partner","business partners"],
  "Company": ["company","pty ltd","pty","proprietary","corporation","corp","limited company","my company"],
  "Trust": ["trust","family trust","unit trust","discretionary trust","trust structure"],
  // DX-3: Debt duration
  "Less than 12 months": ["less than 12","under 12","under a year","less than a year","recent","new debt","just started","few months","couple months","six months","under six months","9 months","about a year"],
  "1 \u2013 2 years": ["1 to 2","one to two","about a year","year and a half","18 months","about two years","couple of years","a year or two"],
  "2 \u2013 5 years": ["2 to 5","two to five","few years","several years","about three","three years","four years","about 3","about 4","a while"],
  "5+ years": ["5 plus","over 5","more than 5","over five","long time","ages","many years","long standing","been going on for years"],
  // DX-4: BAS returns
  "Unsure": ["unsure","not sure","don't know","uncertain","maybe","possibly","not certain","no idea","i'm not sure","what's that"],
  "Partially lodged": ["partial","partially","some lodged","partially lodged","some done","mixed","half done","some of them"],
  "Lodged and up to date": ["up to date","all current","yes all current","fully lodged","all done","completely current","all lodged","yes current","yeah all current"],
  "Never lodged": ["never","never lodged","not filed","none lodged","never done","haven't ever","never have","not done","not lodged"],
  // DX-5: Superannuation
  "Yes": ["yes","yep","yeah","there is","outstanding super","super owing","behind on super","owe super","yes there is"],
  "No": ["no","nope","nah","no super owing","super is current","all paid","super paid","no outstanding","negative"],
  // DX-6: Income tax returns (same option text as DX-4, aliases reused automatically)
  // DX-7: Payment plan
  "Never": ["never","no","nope","haven't","no payment plan","no i haven't","not attempted","never had","no plan","nah"],
  "In current payment plan": ["current plan","in a plan","currently paying","active plan","yes current","paying now","on a plan","have a plan"],
  "Yes but defaulted": ["defaulted","default","broke the plan","failed","couldn't keep up","fell behind","defaulted on it","yes but defaulted"],
  "Attempted but rejected": ["rejected","was rejected","they said no","denied","turned down","refused","they wouldn't accept","attempted but rejected"],
  // DX-8: Director/individual
  "Yes, I am": ["yes","yes i am","yep","correct","that's right","i am","yeah","that's me","yes director","i am the director","yes i'm the director"],
  "No, I'm not": ["no","no i'm not","nope","not a director","no i am not","nah","negative","i'm not","not me"],
  // DX-9: Monthly contribution
  "Yes, I can": ["yes","yes i can","yep","i can","definitely","of course","absolutely","yes i can contribute","i can pay","i can afford it"],
  "No, I can't": ["no","no i can't","nope","can't afford","nothing","zero","no capacity","i can't","not able","unable","negative"],
  "Potentially / Maybe": ["maybe","potentially","perhaps","possibly","depends","not sure","might be able","could possibly","it depends","uncertain"],
  // DX-10: Payment timeframe
  "Up to 1 year": ["up to a year","under a year","within a year","12 months","less than a year","short term","quickly","as fast as possible","after one year","one year","about a year","up to one year"],
  "1 \u2013 2 years": ["1 to 2","one to two","about two years","year and a half","18 months","couple of years","a year or two"],
  "2 \u2013 3 years": ["2 to 3","two to three","about three years","couple of years","thirty months","24 to 36","longer term"],
  // DX-11: Income trending
  "Growing": ["growing","growth","increasing","going up","expanding","improving","getting better","on the up","good"],
  "Stable": ["stable","steady","consistent","same","holding","flat","staying the same","not changing","neutral"],
  "Declining": ["declining","going down","decreasing","falling","worse","dropping","getting worse","struggling","less revenue"],
  // DX-12: Urgency
  "Not yet urgent / planning ahead": ["not urgent","planning ahead","early stages","just planning","proactive","being prepared","thinking ahead","preparation","not yet urgent"],
  "Moderate urgency": ["moderate","somewhat urgent","fairly urgent","getting urgent","reasonably urgent","kind of urgent","medium","in between","moderately"],
  "Very urgent": ["very urgent","urgent","really urgent","super urgent","extremely urgent","need help now","desperate","critical","time sensitive","asap","emergency","pressing"],
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
      const latest = e.results[e.results.length - 1]
      // Process interim results for short commands (Chrome swallows "no","back" as interim)
      if (!latest.isFinal) {
        const interimText = latest[0].transcript.toLowerCase().trim()
        if (interimText.length <= 10) {
          const interimCmd = matchCommand(interimText)
          if (interimCmd && (interimCmd.type === "back" || interimCmd.type === "next")) {
            console.log("🎤 INTERIM CMD:", interimText)
            clearAdv()
            if (interimCmd.type === "next") { cbNext.current(); autoRestart() }
            if (interimCmd.type === "back") { cbBack.current(); autoRestart() }
            try { r.abort() } catch {}
            return
          }
          const noOpt = optsRef.current.find(o => o.toLowerCase().startsWith("no"))
          if (noOpt && (interimText === "no" || interimText === "nope" || interimText === "nah")) {
            console.log("🎤 INTERIM NO-AS-OPTION:", interimText)
            cbSel.current(noOpt!)
            setMicState("confirmed")
            clearAdv()
            autoAdvTimer.current = setTimeout(() => { if (active.current) cbNext.current() }, TIMING.autoAdvanceMs)
            try { r.abort() } catch {}
            autoRestart()
            return
          }
        }
        return
      }
      clearSil()
      const alternatives = Array.from(latest).map((alt: any) => alt.transcript.toLowerCase().trim())
      const webConfidence: number = latest[0].confidence
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
