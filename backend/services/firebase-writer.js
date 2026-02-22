import admin from 'firebase-admin';

async function writeCedLeadToFirestore(ascendData, referralId, ownerUid) {
  if (!referralId) throw new Error("referralId is required");
  if (!ownerUid) throw new Error("ownerUid is required");
  if (!ascendData) throw new Error("ascendData is required");

  try {
    const dataToWrite = {
      ...ascendData,
      ownerUid,
      serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    let attempt = 0;
    let lastError;

    while (attempt < 2) {
      try {
        attempt++;
        await admin
          .firestore()
          .collection('referrals')
          .doc(referralId)
          .set(dataToWrite, { merge: true });

        console.log(`[FIREBASE-WRITE] Success: referral ${referralId}`);
        return referralId;
      } catch (err) {
        lastError = err;
        if (attempt === 1) {
          console.warn(`[FIREBASE-WRITE] Attempt 1 failed, retrying: ${err.message}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw new Error(`Firestore write failed after 2 attempts: ${lastError.message}`);
  } catch (error) {
    console.error(`[FIREBASE-WRITE] Error writing referral ${referralId}:`, error);
    throw error;
  }
}

export { writeCedLeadToFirestore };
