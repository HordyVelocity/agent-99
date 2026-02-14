import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import webhookRouter from "./routes/webhook.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Agent 99 running" });
});

app.post("/", (req, res) => {
  const { message, schema } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });
  res.json({
    message_received: message,
    schema_used: schema || "none",
    status: "Agent 99 placeholder response"
  });
});

app.use(webhookRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Agent 99 running on port " + PORT));
