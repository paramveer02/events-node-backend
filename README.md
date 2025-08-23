# 🎉 Events API Backend

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![Mongoose](https://img.shields.io/badge/ODM-Mongoose-red?logo=mongoose)
![Postman](https://img.shields.io/badge/Tested%20With-Postman-orange?logo=postman)
![Security](https://img.shields.io/badge/Security-Helmet%20%7C%20CORS-blue)
![Auth](https://img.shields.io/badge/Auth-JWT%20%7C%20Cookies-purple)
![AI](https://img.shields.io/badge/GenAI-Google%20Gemini-yellow?logo=google)
![Deploy](https://img.shields.io/badge/Deployed%20On-Render-blueviolet?logo=render)

The backend service for **EventSpark**, a modern event discovery and management platform.  
Built with **Node.js, Express, and MongoDB**, this backend powers authentication, event CRUD operations, AI city guide integration, and geolocation-based event search.

🌐 **Live API**: [https://events-server-wnax.onrender.com](https://events-server-wnax.onrender.com)  
⚡ **Health Check**: [https://events-server-wnax.onrender.com/health](https://events-server-wnax.onrender.com/health)


---

## 🚀 Features

- **Authentication & Authorization**
  - Secure signup, login, logout with JWT + HttpOnly cookies
  - Password hashing with `bcryptjs`
  - Role-based access (`admin` support)

- **Event Management**
  - Create, update, and delete events
  - "My Events" endpoint for user-specific events
  - Geocoding with **node-geocoder** to auto-calculate city + coordinates
  - Fetch nearby events by user location (reverse geocoding)

- **GenAI Integration**
  - AI-powered **City Guide** using Google Generative AI (`@google/generative-ai`)
  - Provides personalized recommendations for shopping, food, and experiences

- **Security & Performance**
  - `helmet` for security headers
  - `cors` with credentials enabled
  - Centralized error handling with custom error classes
  - Input validation with `zod`

- **Developer Friendly**
  - Well-structured: `controllers`, `routes`, `models`, `middlewares`, `utils`
  - Dev data seeding (`dev-data/dbScript.js`)
  - Logs with `morgan`

---

## 📂 API Endpoints

### 🔑 Authentication
- `POST /api/v1/auth/signup` → Register new user  
- `POST /api/v1/auth/login` → Login  
- `GET /api/v1/auth/logout` → Logout  

### 📅 Events
- `POST /api/v1/events` → Create event  
- `GET /api/v1/events/mine` → My events  
- `GET /api/v1/events/near?lat=&lng=` → Nearby events  
- `GET /api/v1/events/:id` → Event by ID  
- `DELETE /api/v1/events/:id` → Delete own event  

### 🤖 AI City Guide
- `POST /api/ai/city-guide` → Get AI-powered recommendations  

### 👤 Users
- `GET /api/v1/users/current-user` → Get current logged-in user  
- `GET /api/v1/users` → (Admin only) All users  
- `GET /api/v1/users/:id/admin` → Promote to admin  

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)  
- **Framework**: Express  
- **Database**: MongoDB Atlas (Mongoose ODM)  
- **Security**: JWT, bcryptjs, helmet, cors  
- **Validation**: Zod  
- **AI**: Google Generative AI (Gemini)  
- **Geo**: node-geocoder (forward + reverse geocoding)  

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/paramveer02/events-node-backend.git
cd events-node-backend

# Install dependencies
npm install

# Create .env file
NODE_ENV=development
PORT=8000
DB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=5d
GEMINI_API_KEY=your_gemini_api_key

# Run in dev
npm run dev

# Run in prod
npm start
