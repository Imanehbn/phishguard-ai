# PhishGuard AI  
### AI-Powered Phishing Email Detection Web Application

PhishGuard AI is a web-based application that uses **Artificial Intelligence** to analyze email content and detect potential **phishing attacks**.  
The application helps users evaluate the risk of an email before interacting with it by providing a **risk score**, a **threat level**, and **security recommendations**, while fully respecting user privacy.

---

##  Project Objectives

- Detect phishing emails using **Natural Language Processing (NLP)**
- Provide a clear **Safe / Suspicious classification**
- Generate a **risk score** and **risk level (LOW / MEDIUM / HIGH)**
- Explain why an email is considered risky
- Ensure **no data storage** and respect **Privacy by Design**

---

##  How It Works

1. The user enters the **email subject and body**
2. The frontend sends the content to an **AI analysis service**
3. A **Large Language Model (LLM)** hosted on **Hugging Face** analyzes the text
4. The model returns a structured JSON response:
   - Risk score
   - Risk level
   - Indicators
   - Security recommendations
5. The results are displayed clearly in the web interface

If the AI service is unavailable, a **local fallback analysis** is used to prevent application failure.

---

##  Architecture Overview

PhishGuard AI follows a **frontend stateless architecture**.

User
↓
React Interface
↓
AI Analysis Service (geminiService.ts)
↓
Hugging Face API (LLM)
↓
Result (Score, Level, Recommendations)

- No backend server
- No database
- No email storage

---

##  Technologies Used

### Frontend
-  React
-  TypeScript
-  Tailwind CSS
-  Recharts

### Artificial Intelligence
-  Large Language Model (LLM)
-  Hugging Face Inference API
-  Natural Language Processing (NLP)

---

##  Security & Privacy

-  No database
-  No email storage
-  Ephemeral processing only
-  Privacy by Design

Emails are analyzed temporarily and are **never saved or logged**.

---

##  Run the Project Locally

### Prerequisites
- Node.js (v18+ recommended)

### Installation

```bash
npm install
