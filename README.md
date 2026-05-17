# File-Transfer-System

> A full-stack secure file sharing platform where users can upload files, generate password-protected shareable links with expiry and download limits, and track analytics — all with a clean white & green UI.
> 
---
 
## 🌐 Live Demo
 
| Service | URL |
|---------|-----|
| 🖥️ Frontend    | https://file-transfer-system-1-nmvu.onrender.com/ |
| ⚙️ Backend     | https://file-transfer-system-3a3w.onrender.com    |
 
---
 
## ✨ Features
 
- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- ☁️ **Cloud File Upload** — Upload any file type via drag & drop to Cloudinary
- 🔗 **Shareable Links** — Generate unique token-based links for any file
- ⏰ **Link Expiry** — Set expiry time (1hr, 24hrs, 7 days, 30 days, or never)
- 🔒 **Password Protection** — Optionally password-protect share links
- 📥 **Download Limits** — Set maximum number of downloads per link
- 📊 **Analytics Dashboard** — Track files, storage, active links, and total downloads
- 📋 **Audit Logs** — Every download logged with IP address and timestamp
- 🚫 **Link Deactivation** — Deactivate any link instantly
- 📱 **Responsive Design** — Works on desktop and mobile
---

## 🏗️ Tech Stack
 
### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI Framework |
| Plain CSS | Styling (Poppins font, glacier green palette) |
| Axios | HTTP client with JWT interceptor |
| Context API | Global auth state management |

### Backend
| Technology | Purpose |
|-----------|---------|
| NestJS | Backend framework |
| TypeORM | ORM for MySQL |
| MySQL | Relational database |
| JWT + Passport | Authentication |
| bcrypt | Password hashing |
| Multer | File upload handling |
| Cloudinary | Cloud file storage |
| nanoid | Unique token generation |
 
---

## 🗄️ Database Schema
 
```
users
├── id (PK)
├── name
├── email (unique)
├── password (bcrypt hashed)
└── created_at
 
files
├── id (PK)
├── user_id (FK → users)
├── original_name
├── cloudinary_url
├── cloudinary_public_id
├── size
├── mime_type
└── created_at
 
share_links
├── id (PK)
├── file_id (FK → files)
├── token (unique, nanoid 12)
├── password (bcrypt hashed, nullable)
├── expires_at (nullable)
├── download_count
├── max_downloads (nullable)
├── is_active
└── created_at
 
download_logs
├── id (PK)
├── share_link_id (FK → share_links)
├── ip_address
└── downloaded_at
```

---
 
## 🔌 API Endpoints
 
### Auth
```
POST /auth/register    → Register new user
POST /auth/login       → Login and get JWT token
```
 
### Files (JWT Required)
```
POST   /files/upload   → Upload file to Cloudinary
GET    /files          → Get all user's files
DELETE /files/:id      → Delete file from Cloudinary + DB
```
 
### Share Links
```
POST   /share                  → Create share link (JWT required)
GET    /share/my-links         → Get all my links (JWT required)
GET    /share/:token           → Access link info (public)
POST   /share/:token/download  → Download file (public)
DELETE /share/:id              → Deactivate link (JWT required)
```
 
### Analytics (JWT Required)
```
GET /analytics   → Get dashboard stats
```
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js v18+
- MySQL 8.0+
- Cloudinary account (free tier works)
---
### 1. Clone the Repository
 
```bash
git clone https://github.com/MohamedArshath10/File-Transfer-System.git

```
---
 
### 2. Backend Setup
 
```bash
cd file-transfer-backend
npm install

```
Create `.env` file in the backend root:
 
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=file_sharing
 
# JWT
JWT_SECRET=your_secret_key_here
 
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
 
# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASS=your_gmail_app_password
 
# App
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
Create MySQL database:
 
```sql
CREATE DATABASE file_sharing;
```
 
Run backend:
 
```bash
npm run start:dev
```

✅ Backend runs at `http://localhost:3001`  
✅ TypeORM auto-creates all 4 tables on first run
 
---

### 3. Frontend Setup
 
```bash
cd file-transfer-frontend
npm install
```
 
Create `.env` file:
 
```env
VITE_API_URL=http://localhost:3001
```
 
Run frontend:
 
```bash
npm run dev
```
 
✅ Frontend runs at `http://localhost:5173`
 
---
 
## 📁 Project Structure
 
```
filevault/
├── file-transfer-backend/
│   └── src/
│       ├── entities/
│       │   ├── user.entity.ts
│       │   ├── file.entity.ts
│       │   ├── share-link.entity.ts
│       │   └── download-log.entity.ts
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   └── jwt.strategy.ts
│       ├── files/
│       │   ├── files.module.ts
│       │   ├── files.service.ts
│       │   ├── files.controller.ts
│       │   └── cloudinary.config.ts
│       ├── share/
│       │   ├── share.module.ts
│       │   ├── share.service.ts
│       │   └── share.controller.ts
│       ├── analytics/
│       │   ├── analytics.module.ts
│       │   ├── analytics.service.ts
│       │   └── analytics.controller.ts
│       ├── app.module.ts
│       └── main.ts
│
└── file-transfer-frontend/
    └── src/
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Links.jsx
        │   └── SharePage.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── ShareModal.jsx
        ├── styles/
        │   └── global.css
        └── App.jsx
```

---

