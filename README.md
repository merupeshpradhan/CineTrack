# 🎬 CineTrack

A modern full-stack Movie Watchlist application built with Next.js, Prisma, PostgreSQL, Cloudinary, and OTP Authentication.

CineTrack allows users to securely log in using Email OTP, manage their personal movie collection, upload movie posters, track watched movies, and organize their watchlist in a beautiful and responsive dashboard.

---

## ✨ Features

* 🔐 Passwordless OTP Authentication
* 🎬 Add New Movies
* ✏️ Edit Movie Details
* 🗑️ Delete Movies
* ☁️ Cloudinary Image Upload
* 📊 Movie Dashboard Analytics
* 🔍 Search Movies
* ✅ Mark Movies as Watched
* 📱 Fully Responsive Design
* ⚡ Fast Server Actions
* 🎨 Modern UI with Tailwind CSS

---

# 📸 Project Screenshots

## Landing Page

![Landing Page](https://github.com/user-attachments/assets/2296774f-a6b5-465d-95b3-de529a2b2272
)

---

## OTP Verification Page

![OTP Verification](https://github.com/user-attachments/assets/195534c6-3b59-4031-9935-a6a9610e7c5a
)

---

## Dashboard

> Add your Dashboard screenshot here

![Dashboard](https://github.com/user-attachments/assets/01eea778-d920-4f91-b019-4d9717597d95
)

---

## Movie Details Page

![Add Movie](https://github.com/user-attachments/assets/70dff946-171a-4cee-881b-a184dc39a97f
)

---

## Edit Movie Page

> Add your Edit Movie screenshot here

![Edit Movie](https://github.com/user-attachments/assets/aed23e30-0c93-4e82-9412-0e037455aae1
)

---

# 🛠️ Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Framer Motion
* React Hot Toast

### Backend

* Next.js Server Actions
* Prisma ORM
* PostgreSQL (Neon)

### Services

* Cloudinary
* Nodemailer

---

# 📂 Folder Structure

```bash
app/
├── dashboard/
├── verify/
├── components/
├── actions/
├── lib/
├── public/
└── prisma/
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url

EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/merupeshpradhan/CineTrack.git
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start development server

```bash
npm run dev
```

---

# 🎯 Future Improvements

* Movie Ratings
* Favorites Collection
* Genre Filtering
* Pagination
* User Profiles
* Movie Recommendations

---

# 👨‍💻 Author

Rupesh Pradhan

Full-Stack Developer passionate about building modern web applications using React, Next.js, Prisma, PostgreSQL, and Cloud Technologies.

---

# 📜 License

This project is licensed under the MIT License.
