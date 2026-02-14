import express from 'express';
import { transformCedToAscend } from '../services/lead-transformer.js';
import { writeCedLeadToFirestore } from '../services/firebase-writer.js';

const router = express.Router();

router.post('/api/sync-lead', async (req, res) => {
  try {
    const { referralId, userId, cedData } = req.body;

    if (!referralId) {
      return res.status(400).json({
        success: false,
        error: "referralId is required in request body",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required in request body",
      });
    }

    if (!cedData) {
      return res.status(400).json({
        success: false,
        error: "cedData is required in request body",
      });
    }

    console.log(`[WEBHOOK] Received sync request for referral: ${referralId}`);

    const ascendData = transformCedToAscend(cedData);
    console.log(`[WEBHOOK] Transformed data, confidence: ${ascendData.confidence}%`);

    const docId = await writeCedLeadToFirestore(ascendData, referralId, userId);
    console.log(`[WEBHOOK] Successfully wrote to Firestore: ${docId}`);

    return res.status(200).json({
      success: true,
      documentId: docId,
      message: "Lead synced to Ascend",
    });
  } catch (error) {
    console.error('[WEBHOOK] Error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
