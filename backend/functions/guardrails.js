const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const db = admin.firestore();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

exports.runGuardrail = functions.https.onCall(async (data, context) => {
  try {
    const { caseId, answers, task } = data;
    if (!caseId) throw new Error('caseId required');
    if (task === 'prep.calculate') return await calculateScore(answers);
    if (task === 'prep.brief') return await generateBrief(caseId, answers);
    return { success: false, error: 'Unknown task' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

async function calculateScore(answers) {
  let score = 50, positivePoints = 0, negativePoints = 0;
  if (answers[1] === 'Sole Trader') positivePoints += 8;
  if (answers[5]?.includes('Yes')) positivePoints += 18;
  if (answers[9] === 'No DPN issued') positivePoints += 15;
  const cashFlow = parseFloat(answers[11]) || 0;
  if (cashFlow >= 3000) positivePoints += 15;
  if (answers[9] === 'Yes, DPN issued') negativePoints -= 25;
  if (cashFlow < 500) negativePoints -= 20;
  score = Math.max(0, Math.min(100, 50 + positivePoints + negativePoints));
  let category = score >= 66 ? 'High Likelihood' : score >= 31 ? 'Moderate Likelihood' : 'Low Likelihood';
  return { success: true, score: Math.round(score), category: category };
}

async function generateBrief(caseId, answers) {
  const strengths = answers[5]?.includes('Yes') ? ['BAS lodged on time'] : [];
  const weaknesses = answers[9] === 'Yes, DPN issued' ? ['DPN issued'] : [];
  const actions = ['Lodge outstanding returns', 'Gather bank statements', 'Prepare payment plan'];
  return { success: true, strengths, weaknesses, actions };
}
