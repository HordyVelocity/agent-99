/**
 * ASCEND / AGENT99 — Voice Types
 * Shared type definitions for voice state machine
 * Date: 22 Feb 2026
 */

export type MicState =
  | "idle"        // Mic ready, not active
  | "listening"   // Capturing audio
  | "processing"  // Matching answer
  | "confirmed"   // High confidence match (≥0.70) — auto-advances
  | "unsure"      // Medium confidence (0.40–0.69) — waits for confirmation
  | "error"       // No match / low confidence (<0.40)
  | "paused";     // Silence timeout — tap to resume

export type MatchTier = "direct" | "alias" | "semantic" | "command" | "none";

export type VoiceMatch = {
  ok: boolean;
  tier: MatchTier;
  option?: string;
  confidence?: number;
  transcript?: string;
  reason?: string;
};

export type VoiceTiming = {
  autoAdvanceMs: number;
  silenceMs: number;
  resumeDelayMs: number;
  restartAfterMatchMs: number;
  restartAfterFailMs: number;
  restartAfterErrorMs: number;
  stepTransitionMs: number;
  confidenceConfirmed: number;
  confidenceUnsure: number;
};
