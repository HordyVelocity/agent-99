const admin = require('firebase-admin');
const db = admin.firestore();
exports.calculateScore = async (caseId, answers) => {
  let score = 50, positivePoints = 0, negativePoints = 0;
  if (answers[1] === 'Sole Trader') positivePoints += 8;
  if (answers[5]?.includes('Yes')) positivePoints += 18;
  if (answers[9] === 'No DPN issued') positivePoints += 15;
  const cashFlow = parseFloat(answers[11]) || 0;
  if (cashFlow >= 3000) positivePoints += 15;
  if (answers[9] === 'Yes, DPN issued') negativePoints -= 25;
  if (cashFlow < 500) negativePoints -= 20;
  score = Math.max(0, Math.min(100, 50 + positivePoints + negativePoints));
  let category = score >= 66 ? 'High' : score >= 31 ? 'Moderate' : 'Low';
  await db.collection('cases').doc(caseId).collection('ai').doc('scores').set({score: Math.round(score), category: category});
  return {success: true, score: Math.round(score), category: category};
};
