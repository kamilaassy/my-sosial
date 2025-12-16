# my-sosial

Repository:
https://github.com/kamilaassy/my-sosial.git

---

## Application Overview

**my-sosial** is a web-based social media application built using **RedwoodJS**.
The application follows a **full-stack architecture** with a clear separation between:

- **Backend (api)**
  GraphQL API, Prisma ORM, authentication and authorization

- **Frontend (web)**
  React, Mantine UI, and a custom **Glassmorphism Design System**

Main features include:
- User authentication (Login & Register)
- Post creation, comments, and likes
- User profiles
- Admin panel (user banning and reports)
- Modern glassmorphism-based UI

---

## Tech Stack

- Node.js (LTS 18 / 20)
- RedwoodJS
- React
- GraphQL
- Prisma ORM
- MySQL / PostgreSQL
- Yarn
- Mantine UI

---

## System Requirements

Before running the application, make sure the following software is installed:

1. **Git**
2. **Node.js** (version 18 or 20 LTS)
3. **Yarn**
4. **Database** (MySQL or PostgreSQL)

### Check installed versions
```bash
git --version
node -v
yarn -v


Panduan Menjalankan Aplikasi my-sosial

Repository GitHub
Repository aplikasi:
https://github.com/kamilaassy/my-sosial.git

Dokumen ini menjelaskan langkah-langkah menjalankan aplikasi my-sosial mulai dari clone repository GitHub hingga aplikasi dapat digunakan.
Prasyarat Sistem
Sebelum menjalankan aplikasi, pastikan perangkat telah terpasang:
1. Git
2. Node.js (versi 18 atau 20 LTS)
4. Database (MySQL atau PostgreSQL)

Cek instalasi dengan perintah:
git --version
node -v
Langkah 1: Clone Repository
Buka terminal atau command prompt, lalu jalankan perintah:

git clone https://github.com/kamilaassy/my-sosial.git
cd my-sosial

Perintah ini akan menyalin source code aplikasi ke komputer lokal.
Langkah 2: Install Dependency
Install seluruh dependency frontend dan backend menggunakan perintah:

yarn install

Langkah ini wajib dilakukan sebelum aplikasi dijalankan.
Langkah 3: Konfigurasi Environment Variable
Buat file bernama .env di direktori utama project.

Contoh konfigurasi:
DATABASE_URL="mysql://user:password@localhost:3306/my_sosial"

Session secret bisa dibuat dengan menggunakan perintah

yarn rw generate secret

lalu kode unik random yang didapatkan bisa dicopas di SESSION_SECRET=

SESSION_SECRET=random-secret

Untuk environtment cloudinary "saya cantumkan didalam komentar link video instalasi" bisa masukkan kedalam file .env Bersama dengan DATABASE_URL dan SESSION_SECRET


File .env tidak disertakan di repository demi keamanan data.
Langkah 4: Setup Database dengan Prisma
Generate Prisma Client:
yarn rw prisma generate

Jalankan migration database:
yarn rw prisma migrate dev

Migration ini akan membuat tabel database sesuai file schema.prisma.
Langkah 5: Menjalankan Aplikasi
Jalankan backend dan frontend secara bersamaan dengan perintah:

yarn rw dev

Aplikasi dapat diakses melalui:
Frontend (Web): http://localhost:8910
Backend (API): http://localhost:8911
Catatan Penting
- Wajib membuat file .env sebelum aplikasi digunakan.
- Migration Prisma wajib dijalankan sebelum aplikasi digunakan.
- Role admin dapat diatur langsung melalui database.
- Frontend dan backend berkomunikasi menggunakan GraphQL API.
