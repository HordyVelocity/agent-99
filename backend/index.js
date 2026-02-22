const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
app.use(cors());
app.use(express.json());
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/cases/:caseId', async (req, res) => {
  try {
    const caseDoc = await db.collection('cases').doc(req.params.caseId).get();
    if (!caseDoc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: caseDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server on port \${PORT}\`));
