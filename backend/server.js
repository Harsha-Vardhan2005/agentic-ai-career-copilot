import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/roadmap", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [{ role: "user", content: req.body.prompt }],
          temperature: 0.7,
          max_tokens: 2000
        })
      }
    );

    const data = await response.json();

    // HARD FAIL if Groq errors
    if (data.error) {
      return res.status(500).json(data.error);
    }

    res.json(data);
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Groq request failed" });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
