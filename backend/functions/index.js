const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const guardrails = require('./guardrails');
const scoring = require('./scoring');
const brief = require('./brief');

exports.runGuardrail = guardrails.runGuardrail;
exports.calculateScore = scoring.calculateScore;
exports.generateBrief = brief.generateBrief;

const voiceMiss = require('./voiceMiss');
exports.logVoiceMiss = voiceMiss.logVoiceMiss;