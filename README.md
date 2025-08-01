## 📌 Project Summary

**Problem**

Most budget apps track spending via credit card integrations and fail to capture **cash transactions**, despite their continued importance (e.g., small merchants, fare discounts). There's a need for a user-friendly app that can track **cash expenses via receipt OCR or manual entry**.

**Solution**

An app that allows users to track spending through **receipt uploads** and **manual input**, with eventual integration of card data and analytics.

---

## 🧠 Stack

- **Frontend:** React
- **Backend:** Fastify
- **OCR Dataset:** [CORU](https://github.com/Update-For-Integrated-Business-AI/CORU)
- **Hosting:** AWS (Elastic Beanstalk)
- **Database:** PostgreSQL (Goal Phase)

---

## 🚀 MVP Phase

### ✅ Features

- [ ]  Local Fastify backend with database stubs
- [ ]  React frontend for:
    - [ ]  Manual entry form
    - [ ]  Receipt upload
- [ ]  Connect backend to frontend

### 🧩 Components

- [ ]  `backend/`: Fastify server with stub routes
- [ ]  `frontend/`: React UI with file input and form
- [ ]  GitHub repo with:
    - [ ]  `README.md`
    - [ ]  Clear setup instructions
- [ ]  Basic backend tests (`Jest` or `Vitest`)

---

## 🎯 Goal Phase

### ✅ Features

- [ ]  Scalable with Docker
- [ ]  Create accounts (user-specific tracking)
- [ ]  Upload and process receipts with CORU OCR
- [ ]  Manually enter expenditures and persist them
- [ ]  Host app on AWS using Elastic Beanstalk

### 🧩 Components

- [ ]  Docker containers for backend + frontend
- [ ]  Real database (Postgres) schema
- [ ]  App frontend with React upload + form
- [ ]  Image upload → Fastify → CORU OCR → DB
- [ ]  Full deployment pipeline to AWS

---

## 🌈 Stretch Phase

### ✅ Features

- [ ]  View spending trends over time/categories
- [ ]  Link credit card data for full financial picture
- [ ]  Authentication & session management
- [ ]  Multi-platform support (mobile & web)

### 🧩 Components

- [ ]  Metrics dashboard (React + Chart.js or Recharts)
- [ ]  Backend APIs for credit card integration
- [ ]  JWT-based auth or OAuth login
- [ ]  Mobile app (React Native or Expo)

---

## 📐 Architecture

- [Architecture diagram (draw.io)](https://app.diagrams.net/#G1vJoh44eiBeqn5U0365Hl4WR4_TItBykv#%7B%22pageId%22%3A%22NWgJDvCX8ibC3eIbreF3%22%7D)

---