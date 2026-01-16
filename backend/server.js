import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import puppeteer from "puppeteer";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findChrome() {
  const baseDir = './chrome-cache';
  const chromeDir = path.join(baseDir, 'chrome');
  
  if (fs.existsSync(chromeDir)) {
    const versions = fs.readdirSync(chromeDir);
    if (versions.length > 0) {
      const chromePath = path.join(chromeDir, versions[0], 'chrome-linux64', 'chrome');
      if (fs.existsSync(chromePath)) {
        return chromePath;
      }
    }
  }
  
  return null;
}

async function fetchWebsiteText(url) {
  const chromePath = findChrome();
  
  if (!chromePath) {
    throw new Error('Chrome executable not found. Make sure build script ran successfully.');
  }
  
  console.log('Using Chrome at:', chromePath);
  
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: chromePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu"
    ]
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
