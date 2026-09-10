# 🚀 DoctorAI: Supabase PostgreSQL & Render Deployment Guide

This guide walks you through connecting your **DoctorAI Node.js/Express Backend** to a free cloud **PostgreSQL Database on Supabase** and deploying it on **Render**.

---

## 🏗️ Architecture Overview

```
+------------------------------------+        +----------------------------------------+
|       DoctorAI Frontend UI         |        |       DoctorAI Express Backend         |
|   (Netlify / Vercel / Localhost)   | -----> |          (Deployed on Render)          |
+------------------------------------+        +----------------------------------------+
                                                                  |
                                                                  | (DATABASE_URL with SSL)
                                                                  v
                                              +----------------------------------------+
                                              |       Supabase Cloud Database          |
                                              |       (Managed PostgreSQL 15+)         |
                                              +----------------------------------------+
```

---

## ⚡ Step 1: Create a Free Supabase PostgreSQL Database

1. Open **[https://database.new](https://database.new)** (or go to [supabase.com](https://supabase.com)).
2. Sign in with your **GitHub** account.
3. Click **"New Project"**.
4. Fill in the project details:
   - **Name**: `doctorai-db`
   - **Database Password**: Set a strong password and **write it down** (you will need it in the connection string).
   - **Region**: Choose the region closest to you or your Render service (e.g., `Singapore`, `Frankfurt`, or `US East`).
5. Click **"Create new project"** (it takes about 1–2 minutes to provision).

---

## 🔑 Step 2: Get Your PostgreSQL Connection String (`DATABASE_URL`)

1. In your Supabase project dashboard, click the **Settings** (gear icon ⚙️) in the bottom-left sidebar.
2. Select **Database**.
3. Scroll down to the **Connection string** section.
4. Select the **URI** tab:
   - Mode: **Session** (port `5432`) or **Transaction Pooler** (port `6543`).
   - You will see a URI formatted like:
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
     ```
5. Copy this URI and replace `[YOUR-PASSWORD]` with the actual database password you created in Step 1.
   *(Example: `postgresql://postgres.yourproject:MyPass123!@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`)*

---

## 🗄️ Step 3: (Optional) Run the SQL Schema in Supabase

> **Note**: DoctorAI backend will **automatically** create the `users` and `appointments` tables upon starting when `DATABASE_URL` is set.
> If you prefer to manually run it beforehand:

1. In your Supabase dashboard, click **SQL Editor** (icon `>_`) on the left sidebar.
2. Click **"New Query"**.
3. Open [`backend/schema.sql`](backend/schema.sql), copy all contents, paste into the query editor, and click **Run**:

```sql
-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient',
    specialty VARCHAR(255),
    license_number VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id VARCHAR(64),
    doctor_name VARCHAR(255),
    specialty VARCHAR(255),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
```

---

## 🌐 Step 4: Configure Environment Variables in Render

1. Log in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click on your existing DoctorAI backend Web Service (e.g. **`doctorai-adv-anshul-1`**).
3. In the left navigation menu, click **Environment**.
4. Add the following **Environment Variables**:

| Key | Value | Notes |
| :--- | :--- | :--- |
| **`DATABASE_URL`** | `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres` | Your Supabase connection URI from Step 2 |
| **`JWT_SECRET`** | `DoctorAiSuperSecureKey2026!` | Any random secret key for signing tokens |
| **`PORT`** | `3001` (or leave default `$PORT`) | Render assigns its own port dynamically |

5. Click **"Save Changes"**. Render will automatically trigger a new build & redeploy!

---

## 📦 Step 5: Push the Code Updates to GitHub

Make sure your GitHub repository (`https://github.com/anshbytecode/DoctorAiadvance`) has the latest backend code:

```bash
git add backend/
git commit -m "feat(backend): add Supabase PostgreSQL integration with auto table migration"
git push origin main
```

Once pushed, Render will detect the commit and deploy the new version.

---

## ✅ Step 6: Verify Everything is Working

### 1. Test the Health Endpoint
Open your live Render health URL in your browser:
👉 **`https://doctorai-adv-anshul-1.onrender.com/api/health`**

You should see:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "PostgreSQL (Supabase)",
  "mode": "cloud",
  "timestamp": "2026-09-10T..."
}
```

### 2. Check the Supabase Table Editor
1. Open your frontend at **`https://doctoraiviaaanshul.netlify.app/`** (or `http://localhost:8081`).
2. Sign up with a new account or create an appointment.
3. Open your **Supabase Dashboard** -> **Table Editor** -> **`users`** or **`appointments`**.
4. You will see your newly registered user and appointment data stored permanently in the cloud!
