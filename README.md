# SkinLens 🧴

Scan skincare ingredient labels and get instant, personalised analysis — powered by Mistral AI.

## Features (Phase 1)
- 📸 Camera capture or photo upload
- ✍️ Manual text input as fallback
- 🔍 AI reads the ingredients section from the photo automatically
- 🟢 Clean / 🟡 Caution / 🔴 Avoid rating per ingredient
- ⚠️ Personal allergy & sensitivity flagging
- 💾 Profile saved locally in browser (skin type, allergies)
- 📱 Fully responsive — mobile, tablet, desktop
- 🔑 API key hidden server-side (users never see it)

---

## Local Setup in VSCode

### 1. Install dependencies
```bash
npm install
```

### 2. Install Vercel CLI (needed to run serverless functions locally)
```bash
npm install -g vercel
```

### 3. Get your free Mistral API key
- Go to https://console.mistral.ai
- Sign up (no credit card needed)
- Create an API key under API Keys

### 4. Add your key to .env
Open the `.env` file and replace the placeholder:
```
MISTRAL_API_KEY=your_actual_key_here
```

### 5. Run locally
```bash
vercel dev
```
Open http://localhost:3000 — the serverless function runs automatically.

> Note: use `vercel dev` not `npm run dev` so the /api/analyse function works locally.

---

## Deploy to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "first commit"
# create a repo on github.com, then:
git remote add origin https://github.com/yourusername/skinlens.git
git push -u origin main
```

### Step 2 — Import to Vercel
1. Go to https://vercel.com
2. Click "Add New Project" → import your GitHub repo
3. Click Deploy (zero config needed — Vite is auto-detected)

### Step 3 — Add your API key as an environment variable
1. In your Vercel project → Settings → Environment Variables
2. Add: `MISTRAL_API_KEY` = your key
3. Redeploy (or it picks up on next deploy)

Your app is now live at `https://your-project.vercel.app` 🎉

---

## How it works
- Frontend (React) → calls `/api/analyse`
- `/api/analyse` (Vercel serverless function) → calls Mistral API with your key
- Your API key never touches the browser

---

## Coming up (Phase 2)
- Skin type % match recommendations
- Product history log
- Side-by-side product comparison
- Hyram-inspired ingredient scoring framework
