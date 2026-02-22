const admin = require('firebase-admin');
const db = admin.firestore();
exports.generateBrief = async (caseId, answers, score) => {
  const strengths = answers[5]?.includes('Yes') ? ['BAS compliant'] : [];
  const weaknesses = answers[9] === 'Yes, DPN issued' ? ['DPN issued'] : [];
  const actions = ['Lodge returns', 'Gather statements', 'Prepare plan'];
  await db.collection('cases').doc(caseId).collection('ai').doc('brief').set({strengths, weaknesses, actions, score: Math.round(score)});
  return {success: true, strengths, weaknesses, actions};
};
