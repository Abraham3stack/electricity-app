# ⚡ PowerTrack – Electricity Usage Tracker

PowerTrack is a full-stack web application that helps users track electricity usage, predict how long their units will last, and receive insights to optimize consumption.

---

## 🚀 Live Demo

Frontend: https://electricity-app-ten.vercel.app  
Backend: https://electricity-app-yd3w.onrender.com

---

## 🧠 Features

- 🔐 User Authentication (JWT-based login & register)
- ⚡ Track electricity units (kWh)
- 📊 Usage logging and history
- 🔮 Predict how many days electricity will last
- 💡 Smart insights and recommendations
- 📈 Usage trend visualization
- 📱 Fully responsive UI

---

## 🏗️ Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM

### Database
- PostgreSQL (Supabase)

### Deployment
- Frontend: Vercel
- Backend: Railway

---

## ⚙️ Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=https://electricity-app-production.up.railway.app/api
```

### Backend (.env)
```
PORT=5001
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

---

## 🧪 How to Run Locally

### 1. Clone repository
```
git clone https://github.com/Abraham3stack/electricity-app.git
cd electricity-app
```

### 2. Setup Backend
```
cd backend
npm install
npm run dev
```

### 3. Setup Frontend
```
cd frontend
npm install
npm run dev
```

---

## 📌 How It Works

1. User registers or logs in
2. Inputs current electricity units from meter
3. Logs daily usage
4. App calculates:
   - Average usage per day
   - Estimated days remaining
5. App provides insights and recommendations

---

## 🧠 Key Learnings

- Full-stack application architecture
- JWT authentication
- REST API design
- Database modeling with Prisma
- Deployment with Railway & Vercel
- Handling real-world edge cases (auth, errors, async data)

---

## 👤 Author

Abraham Ogbu

---

## ⭐ Acknowledgements

This project was built as part of a full-stack learning journey and demonstrates real-world problem solving and production deployment.
