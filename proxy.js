// proxy.js
const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
app.use(express.json({ limit: "10mb" }));

// GANTI dengan URL Apps Script kamu
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFP8-HnuKxETR74pvUc5nzMOVnBMHuvUjDqJ71_q2VG6PAV_PrjydTp30m_r9MNiqPSA/exec";

// Proxy route untuk upload CV
app.post("/upload", async (req, res) => {
  try {
    const r = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const text = await r.text();
    res.set("Access-Control-Allow-Origin", "*");
    res.type("application/json").send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Tambah OPTIONS handler untuk preflight
app.options("/upload", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.send();
});

app.listen(3000, () =>
  console.log("✅ Proxy berjalan di https://vercel.com/adam-s-projects-28c68d94/program-cv/upload")
);

