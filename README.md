# FitTrack AI 🏋️‍♂️🤖

FitTrack AI is a full-stack health & fitness web application powered by **Java Spring Boot**, **React.js**, **PostgreSQL / MySQL**, and **Google Gemini API**. It enables users to log their physical biometrics, track weight trajectory with interactive charts, calculate real-time BMI metrics, and receive personalized workout, nutrition, hydration, and recovery guidance from a context-aware AI Fitness Coach.

### 🌐 Live Production Deployments
- **Frontend (Vercel)**: [https://fittrack-ai-srujan.vercel.app](https://fittrack-ai-srujan.vercel.app)
- **Backend API (Render)**: [https://fittrack-ai-backend-kwax.onrender.com](https://fittrack-ai-backend-kwax.onrender.com)
- **Health Check**: [https://fittrack-ai-backend-kwax.onrender.com/api/health](https://fittrack-ai-backend-kwax.onrender.com/api/health)

---

## 🏛 Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │                     React Frontend                      │
   │  (Vite + React Router + Obsidian Theme + Vanilla CSS)   │
   └───────────────────────────┬─────────────────────────────┘
                               │ REST APIs (JSON)
                               ▼
   ┌─────────────────────────────────────────────────────────┐
   │                 Spring Boot Backend                     │
   │  (Controller → Service → Repository → Entity / DTO)    │
   │           Security: BCrypt Password Hashing             │
   └─────────────┬─────────────────────────────┬─────────────┘
                 │ JPA / Hibernate             │ HTTPS / REST
                 ▼                             ▼
   ┌───────────────────────────┐ ┌───────────────────────────┐
   │       MySQL Database      │ │      Google Gemini AI     │
   │ (users & weight_records)  │ │ (gemini-1.5-flash model)  │
   └───────────────────────────┘ └───────────────────────────┘
```

- **Frontend**: React 18, React Router v6, Lucide Icons, Vanilla CSS Design System with dark obsidian glassmorphism.
- **Backend**: Java 17+, Spring Boot 3.3.4, Spring Data JPA, Spring Security (BCrypt), Jakarta Validation.
- **Database**: MySQL 8.0+.
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`), with context-driven prompt engineering based on user biometrics.
- **Security**: Gemini API keys and database credentials remain strictly confidential in the backend.

---

## 📁 Project Directory Structure

```
fittrack-ai/
├── docker-compose.yml              # One-command MySQL container setup
├── README.md                       # Comprehensive documentation
│
├── backend/                        # Java Spring Boot Backend
│   ├── pom.xml                     # Maven dependencies & build setup
│   ├── mvnw / mvnw.cmd             # Maven wrapper scripts
│   ├── .env.example                # Backend environment template
│   └── src/
│       ├── main/
│       │   ├── java/com/fittrack/ai/
│       │   │   ├── FitTrackAiApplication.java
│       │   │   ├── config/         # Security, CORS, Gemini REST client configs
│       │   │   ├── controller/     # Auth, User, Weight, and AI REST controllers
│       │   │   ├── dto/            # Request/Response data transfer objects
│       │   │   ├── entity/         # JPA Entities: User and WeightRecord
│       │   │   ├── exception/      # Global exception handling & custom errors
│       │   │   ├── repository/     # Spring Data JPA repositories
│       │   │   └── service/        # Core business logic & Gemini integration
│       │   └── resources/
│       │       ├── application.properties
│       │       └── schema.sql      # Optional manual MySQL schema DDL
│
└── frontend/                       # React.js Frontend
    ├── package.json                # React dependencies
    ├── vite.config.js              # Vite server & proxy configuration
    ├── index.html                  # HTML entry point with Google Fonts
    ├── .env.example                # Frontend environment template
    └── src/
        ├── main.jsx                # Application root
        ├── App.jsx                 # Routes & protected route provider
        ├── index.css               # Modern obsidian dark design system
        ├── api/                    # apiClient, auth, user, weight, and AI services
        ├── context/                # AuthContext (state, user session, profile)
        ├── components/             # Navbar, Footer, MetricCard, WeightChart, ProtectedRoute
        └── pages/                  # Login, Register, Dashboard, Profile, WeightTracking, AiChat
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Java Development Kit (JDK 17 or higher)** (`java -version`)
- **Maven 3.8+** (or use the included `./mvnw`)
- **Node.js 18+ & npm** (`node -v`)
- **MySQL 8.0+** (or Docker)

---

### 2. MySQL Database Setup

#### Option A: Using Docker (Fastest)
Run the preconfigured MySQL container in the root directory:
```bash
docker compose up -d
```
This automatically boots a MySQL container on port `3306` with database `fittrack_db` and password `root`.

#### Option B: Using Local MySQL Server
1. Log into your local MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS fittrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
*(Spring Boot's `ddl-auto=update` will automatically create and update the `users` and `weight_records` tables upon startup).*

---

### 3. Google Gemini API Key Configuration

1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).
2. You can configure the key via environment variable:
   ```bash
   export GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
   ```
   Or set it directly in `backend/src/main/resources/application.properties`:
   ```properties
   gemini.api.key=AIzaSyYourGeminiApiKeyHere
   ```
> **Note**: If no Gemini API key is provided, FitTrack AI will smoothly fallback to its built-in personalized fitness coach responses, allowing complete evaluation out of the box!

---

### 4. Backend Startup (Spring Boot)

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   *(Or using the Maven wrapper: `./mvnw spring-boot:run`)*
3. The backend will start on **`http://localhost:8080`**.
4. Test the health by checking that the port is listening.

---

### 5. Frontend Startup (React.js)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   👉 **`http://localhost:5173`**

---

## 📱 Application Flow & Features

1. **Authentication (`/login`, `/register`)**:
   - Secure registration with physical stats (age, height, weight, activity level, fitness goal).
   - Passwords securely hashed with BCrypt.
   - Quick one-click **"Auto-fill Demo Credentials"** button for quick testing.
2. **Dashboard (`/dashboard`)**:
   - Auto-calculated BMI and WHO category badge (Underweight, Normal, Overweight, Obese).
   - Key physical metrics: Current Weight, Height, Activity Level, Target Goal.
   - Dynamic evidence-based fitness tips customized to user goals.
   - Quick weight trajectory graph and AI coaching prompt chips.
3. **Workout Tracker (`/workouts`)**:
   - Comprehensive exercise logging with custom sets, reps, weight (kg), and duration.
   - Built-in popular workout templates: Push Day, Pull Day, Leg Day, HIIT & Cardio, Upper Body.
   - Cumulative training KPI metrics: total sessions, total volume (kg), training time, top muscle focus.
   - Interactive expandable session cards with detailed exercise breakdown and deletion.
4. **User Profile (`/profile`)**:
   - Real-time profile updating with instant BMI recalculation preview.
   - Updates directly synchronize with the backend MySQL database.
5. **Weight Tracking (`/weight-tracking`)**:
   - Log body weight with date and optional notes.
   - Automatic line chart rendering with glow styling and data tooltips.
   - Summary statistics: Starting weight, Net +/- change, Lowest/Highest weight, Total entries.
   - Full history table with delete entry action.
6. **Gemini AI Coach (`/ai-chat`)**:
   - Context-aware fitness assistant powered by Google Gemini.
   - Passes user's physical profile (Age, Height, Weight, BMI, Activity Level, Goal) into the AI system context.
   - Pre-canned quick prompt chips:
     - *"What workout is suitable for me?"*
     - *"What should I eat before exercise?"*
     - *"How can I improve my fitness?"*
     - *"Give me hydration and recovery tips."*
   - Real-time typing indicators and markdown-like response rendering.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/auth/register` | Register new user account | `{ name, email, password, age, height, weight, activityLevel, fitnessGoal }` |
| `POST` | `/api/auth/login` | Authenticate existing user | `{ email, password }` |
| `GET`  | `/api/users/{id}` | Fetch user profile and calculated BMI | — |
| `PUT`  | `/api/users/{id}` | Update user profile attributes | `{ name, age, height, weight, activityLevel, fitnessGoal }` |
| `POST` | `/api/weight` | Log a weight entry | `{ userId, weight, recordDate, notes }` |
| `GET`  | `/api/weight/{userId}` | Get chronological weight logs | — |
| `GET`  | `/api/weight/{userId}/stats` | Get weight progress statistics | — |
| `DELETE`| `/api/weight/{id}?userId={uid}` | Delete a weight log | — |
| `POST` | `/api/workout` | Log a new workout session with exercises | `{ userId, workoutName, sessionDate, durationMinutes, notes, exercises }` |
| `GET`  | `/api/workout/{userId}` | Get user's workout sessions history | — |
| `GET`  | `/api/workout/{userId}/stats` | Get aggregate workout stats & lift volume | — |
| `DELETE`| `/api/workout/{sessionId}?userId={uid}` | Delete a workout session | — |
| `POST` | `/api/ai/chat` | Get personalized Gemini advice | `{ userId, message }` |
| `GET`  | `/api/health` | Service health status check | — |

---

## 🚀 Production Deployment Guide

### Option 1: Docker Compose (Full-Stack All-In-One)
The repository contains a production multi-stage build setup for MySQL, Spring Boot, and Nginx-powered React:
```bash
# Build and run all services in background
docker compose up -d --build

# View container status
docker compose ps
```
- **Frontend**: `http://<your-server-ip>:80`
- **Backend**: `http://<your-server-ip>:8080`
- **MySQL**: Internal network `mysql-db:3306`

### Option 2: Cloud Deployment (Render for Backend + Vercel for Frontend)

#### Step 1: Deploy Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service** (or use **Blueprint** with the included `render.yaml`).
2. Connect your GitHub repository: `https://github.com/SRUJAN-18/fittrack-ai`.
3. Configure the settings:
   - **Name**: `fittrack-ai-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile` (or `./Dockerfile` if Root Directory is `backend`)
   - **Instance Type**: `Free`
   - **Health Check Path**: `/api/health`
4. Add **Environment Variables**:
   - `PORT`: `8080`
   - `SPRING_DATASOURCE_URL`: JDBC database URL (e.g., MySQL from TiDB Cloud / Aiven / Railway or Render PostgreSQL `jdbc:postgresql://<host>:5432/<db>`)
   - `SPRING_DATASOURCE_USERNAME`: database username
   - `SPRING_DATASOURCE_PASSWORD`: database password
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key
   - `GEMINI_API_MODEL`: `gemini-3.5-flash-lite`
5. Click **Create Web Service**.
6. Once deployed, Render will provide your backend URL:
   `https://<your-service-name>.onrender.com` (Test health via `https://<your-service-name>.onrender.com/api/health`)

#### Step 2: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import** next to `SRUJAN-18/fittrack-ai`.
2. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://<your-service-name>.onrender.com/api` (the backend URL from Step 1)
4. Click **Deploy**.
5. Vercel will build and assign your production frontend URL:
   `https://<your-project-name>.vercel.app` (e.g., `https://fittrack-ai.vercel.app`)

---

## ⚙️ Environment Variables Summary

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/fittrack_db?...` | MySQL connection string |
| `SPRING_DATASOURCE_USERNAME` | `root` | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | `root` | MySQL password |
| `GEMINI_API_KEY` | *(empty / fallback)* | Google Gemini API key |
| `GEMINI_API_MODEL` | `gemini-3.5-flash-lite` | Gemini model name |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Comma-separated allowed frontend origins |
| `VITE_API_URL` | `http://localhost:8080/api` | REST API base URL for React |

---

## 💡 Troubleshooting

- **CORS Error in Browser**: Set `CORS_ALLOWED_ORIGINS` in your backend environment variables to include your production frontend URL (e.g. `https://my-app.vercel.app`).
- **MySQL Connection Refused**: Verify that your MySQL server is running on port `3306`, or run `docker compose up -d` in the root folder.
- **Gemini Rate Limits**: If a Gemini API call is rate-limited or fails, the backend seamlessly falls back to the embedded sports nutritionist and trainer logic.
