const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.post("/communications/feedbackPopup", (req, res) => {
  // Simulate success for local testing
  console.log("Received feedback:", {
    userPlatform: req.body?.userPlatform,
    screenshotIncluded: req.body?.screenshotIncluded,
    userFeedback: req.body?.userFeedback,
    hasScreenshot: Boolean(req.body?.userScreenshot),
  });
  res.status(200).json({ ok: true });
});

app.get("/health", (_req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`);
});


