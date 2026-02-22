# Agent99 Page 009 - Appointment Preparation
AI-driven member interview for ATO debt negotiation likelihood assessment.

## Features
- 15-question guardrail interview
- Real-time likelihood scoring
- Firebase integration
- Cloud function orchestration

## Setup
npm install
firebase deploy --only functions
firebase deploy --only firestore:rules

## Files
- page_009_widget.dart - Main UI
- guardrails.js - Question routing
- scoring.js - Score calculations
- brief.js - Brief generation
- firestore.rules - Security rules
