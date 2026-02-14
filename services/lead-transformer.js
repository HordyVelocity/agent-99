function transformCedToAscend(cedData) {
  const contactInfo = cedData?.contactInfo || {};
  const leadInfo = cedData?.leadInfo || {};
  const metadata = cedData?.metadata || {};

  const confidencePercent = metadata.confidence
    ? Math.round(metadata.confidence * 100)
    : 0;

  return {
    clientName: contactInfo.name || "(Not provided)",
    clientEmail: contactInfo.email || "",
    clientPhone: contactInfo.phone || "",
    clientCompany: contactInfo.company || "(Not provided)",
    serviceNeeded: leadInfo.interest || "",
    budgetEstimate: leadInfo.budget || "",
    urgency: leadInfo.urgency || "medium",
    source: "agent_99",
    confidence: confidencePercent,
    capturedAt: metadata.extractedAt || new Date().toISOString(),
    status: "lead_captured",
    assignedTo: null,
    notes: "Auto-synced from Ced bot extraction",
    createdAt: new Date().toISOString(),
  };
}

export { transformCedToAscend };
