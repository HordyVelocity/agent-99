const functions = require("firebase-functions")
const admin = require("firebase-admin")

exports.logVoiceMiss = functions
  .region("australia-southeast1")
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Headers", "Content-Type")
    if (req.method === "OPTIONS") { res.status(204).send(""); return }
    try {
      const { transcript, questionIndex, options, timestamp } = req.body
      await admin.firestore().collection("voice_misses").add({
        transcript,
        questionIndex,
        options,
        timestamp,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
      res.json({ ok: true })
    } catch(e) {
      res.status(500).json({ error: e.message })
    }
  })
