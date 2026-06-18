# 🎬 CineTrack

A modern **Movie Tracking Platform** built with **Next.js, Prisma, Neon PostgreSQL, Cloudinary, JWT Authentication, OTP Verification, and Tailwind CSS**.

Users can securely create an account, verify identity using OTP, manage authentication sessions, and build their personal movie library.

---

## 🚀 Live Demo

🌐 Live Project: https://cinetrack-pro.vercel.app/

💻 Repository: https://github.com/merupeshpradhan/CineTrack

👨‍💻 Portfolio (Optional): https://merupeshpradhan.vercel.app/

---

# ✨ Features

## 🔐 Authentication System

* User Registration
* User Login
* OTP Email Verification
* JWT Access Token Authentication
* Refresh Token Session Recovery
* Protected Routes
* Secure Cookie Handling

## 🎥 Movie Management

* Add Movies
* Upload Movie Posters
* View Personal Movie Library
* Dashboard Interface
* Track Watch History

## ☁️ Media Storage

* Cloudinary Integration
* Image Upload Optimization

## 🗄 Database

* PostgreSQL (Neon)
* Prisma ORM

## 🎨 UI / UX

* Fully Responsive Design
* Toast Notifications
* Modern Glass UI
* Animated Components
* Mobile Friendly

---

# 🧱 Tech Stack

## Frontend

* Next.js 16
* React 19
* Tailwind CSS
* Framer Motion
* React Hot Toast

## Backend

* Next.js API Routes
* Prisma ORM
* Neon PostgreSQL
* JWT Authentication
* Nodemailer

## Cloud Services

* Cloudinary
* Vercel

---

# 📂 Project Structure

```bash
CineTrack/
├── .next/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   ├── refresh/
│   │   │   │   └── route.ts
│   │   │   ├── send-otp/
│   │   │   │   └── route.ts
│   │   │   └── verify-otp/
│   │   │       └── route.ts
│   │   ├── movie/
│   │   │   ├── addMovie/
│   │   │   │   └── route.ts
│   │   │   ├── deleteMovie/
│   │   │   │   └── route.ts
│   │   │   ├── toggleWatched/
│   │   │   │   └── route.ts
│   │   │   └── updateMovie/
│   │   │       └── route.ts
│   │   ├── profile/
│   │   │   └── route.ts
│   │   └── user/
│   │       └── route.ts
│   ├── dashboard/
│   │   ├── add-movie/
│   │   │   └── page.tsx
│   │   └── movie/[id]/
│   │       ├── edit/
│   │       │   ├── EditMovieForm.tsx
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── verify/
│   │   └── page.tsx
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── header/
│   │   └── Header.tsx
│   ├── login/
│   │   ├── HeroContent.tsx
│   │   ├── LoginAnimatedPosterGrid.tsx
│   │   └── OtpLoginCard.tsx
│   ├── movie/
│   │   ├── actions/
│   │   │   ├── DeleteButton.tsx
│   │   │   └── WatchedCheckbox.tsx
│   │   └── add/
│   │       ├── AddMovieForm.tsx
│   │       ├── BackButton.tsx
│   │       ├── DurationInput.tsx
│   │       ├── LocationInput.tsx
│   │       ├── MovieDetails.tsx
│   │       ├── PosterUpload.tsx
│   │       ├── SubmitButton.tsx
│   │       └── WatchDatePicker.tsx
│   ├── MovieBox.tsx
│   ├── MovieDataStreamer.tsx
│   ├── SearchBox.tsx
│   ├── verify/
│   │   ├── VerifyAnimatedPosterGrid.tsx
│   │   └── VerifyOtpCard.tsx
│   ├── Footer.tsx
│   └── ToastProvider.tsx
├── lib/
│   ├── api-client.ts
│   ├── auth.ts
│   ├── cloudinary.ts
│   └── prisma.ts
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   └── vite.svg
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── prisma.config.ts
├── proxy.ts
├── README.md
└── tsconfig.json
```

---

# ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/merupeshpradhan/CineTrack.git
```

Move into project:

```bash
cd CineTrack
```

Install packages:

```bash
npm install
```

Create environment file:

```env
DATABASE_URL=

EMAIL_USER=
EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# 🔑 Environment Variables

| Variable              | Purpose             |
| --------------------- | ------------------- |
| DATABASE_URL          | PostgreSQL Database |
| EMAIL_USER            | Email Sender        |
| EMAIL_PASS            | Email App Password  |
| CLOUDINARY_CLOUD_NAME | Cloudinary Cloud    |
| CLOUDINARY_API_KEY    | Cloudinary Access   |
| CLOUDINARY_API_SECRET | Cloudinary Secret   |
| ACCESS_TOKEN_SECRET   | JWT Access Token    |
| REFRESH_TOKEN_SECRET  | JWT Refresh Token   |

---

# 🔒 Authentication Flow

```text
Register
   ↓
OTP Verification
   ↓
Generate Access Token
   ↓
Generate Refresh Token
   ↓
Store Session
   ↓
Dashboard Access
```

---

# 📸 Screenshots

* Login Page
* OTP Verification
* Dashboard
* Add Movie

---

# 🧠 Learning Outcomes

This project helped practice:

* Full Stack Development
* Authentication Flow
* Session Management
* File Upload Handling
* Prisma ORM
* Database Design
* API Development
* Production Deployment

---

# 👨‍💻 Developer

**Rupesh Pradhan**

Built as part of **Chai Aur Code Assignment**

---

# 📄 License

This project is for educational and portfolio purposes.
