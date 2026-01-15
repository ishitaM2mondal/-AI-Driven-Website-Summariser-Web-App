# 🌐 AI Website Summarizer

A simple full-stack web application that allows users to enter any public website URL and receive a concise, readable summary generated using **Google Gemini AI**.

The project focuses on clean UI, real webpage scraping, and practical AI integration.

---

## ✨ Features

- 🌍 Summarize content from any public website URL  
- 🤖 AI-powered summaries using **Gemini API**  
- 🧠 Bullet-point & markdown-style formatted summaries  
- 🌙 Dark / Light theme toggle  
- 🎨 Clean, human-designed UI (not flashy or AI-looking)  
- 📱 Fully responsive (mobile & desktop)  
- ⏳ Loading indicators & error handling  

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- CSS (custom, no UI frameworks)
- Fetch API

### Backend
- Node.js
- Express.js
- Puppeteer (for real webpage scraping)
- Google Gemini API

---

## 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd project-root
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:

```bash
node server.js
```

The backend will run on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

## 🔄 How the Application Works

1. User enters a website URL in the frontend  
2. Frontend sends the URL to the backend (`/summarize` endpoint)  
3. Backend uses **Puppeteer** to load the webpage and extract visible text  
4. Extracted text is sent to **Gemini AI** with a summarization prompt  
5. Gemini returns a concise summary  
6. Summary is sent back to the frontend and rendered with markdown formatting  

---

## 🤖 How AI Is Used

This project uses **Google Gemini AI** to:

- Understand long, unstructured webpage content
- Identify key ideas and important points
- Condense information into **clear bullet points**

### Prompt Strategy

The AI is instructed to:
- Focus only on meaningful content
- Avoid unnecessary repetition
- Respond in a structured, bullet-friendly format

Example prompt:

```
Summarize this webpage in simple bullet points:
<extracted webpage text>
```

---

## 🧠 Why Puppeteer Was Used

- Many modern websites load content dynamically using JavaScript
- Simple HTTP requests often return incomplete or empty HTML
- Puppeteer ensures:
  - JavaScript-rendered content is captured
  - Real, visible text is extracted accurately

This improves summary quality and reliability.

---

## 🎨 UI & UX Decisions

- Neutral, editorial color palette (SaaS-style)
- Single accent color for primary actions
- No neon gradients or excessive animations
- Dark mode optimized for readability
- Subtle transitions for a polished feel

These choices keep the UI professional and interview-ready.

---

## 🚀 Possible Enhancements

- Save summary history
- Export summary as PDF
- Multi-language summaries
- SEO-focused summarization
- Authentication and user accounts
- Deployment (Vercel + Render)

---

## 📌 Notes

- Only public URLs are supported
- Some websites may block scraping
- Gemini free-tier quota limits apply

---

## 👨‍💻 Author

Built as part of a AI-Driven Website Summariser Web App assignment to demonstrate:
- Practical AI integration
- Clean UI design
- Real-world React & Node.js usage

