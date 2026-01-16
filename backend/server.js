import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import puppeteer from "puppeteer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function fetchWebsiteText(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu"
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 
                    puppeteer.executablePath()
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const text = await page.evaluate(() => {
      return document.body.innerText;
    });

    if (!text || text.length < 500) {
      throw new Error("Unable to extract readable content");
    }

    return text;
  } finally {
    await browser.close();
  }
}

app.post("/summarize", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY missing");
    }

    const pageText = await fetchWebsiteText(url);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Summarize this webpage in simple bullet points:\n\n${pageText.slice(
                    0,
                    6000
                  )}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      throw new Error("No summary returned from Gemini");
    }

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
