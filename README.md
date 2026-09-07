Sistem Kepegawaian Digital

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-111827)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

*Sistem Kepegawaian Digital* adalah aplikasi web HRIS untuk membantu perusahaan mengelola data karyawan, cuti, izin, lembur, persetujuan, struktur organisasi, hingga laporan kepegawaian dalam satu sistem terintegrasi.

Project ini dikembangkan sebagai **prototype sistem manajemen sumber daya manusia** dengan konsep **Role-Based Access Control**, sehingga setiap pengguna hanya dapat mengakses fitur sesuai dengan perannya.

---

🚀 Live Demo

🌐 *Demo* 
https://sistem-kepegawaian-chi.vercel.app/

💻 *Repository* 
https://github.com/khalilurrahmanmahdi12/sistem_kepegawaian

---

✨ Fitur Utama

📊 Dashboard Kepegawaian

Menampilkan ringkasan informasi kepegawaian seperti:

- 👥 Total karyawan
- 🟢 Karyawan aktif
- 🏢 Distribusi departemen
- 📅 Ringkasan kehadiran
- 🌴 Pengajuan cuti
- 📝 Pengajuan izin
- ⏱️ Pengajuan lembur
- ✅ Persetujuan tertunda
- 📈 Grafik statistik kepegawaian
- 🕒 Aktivitas terbaru

Dashboard membantu HR dan manajemen mendapatkan gambaran kondisi kepegawaian secara cepat.

---

👥 Manajemen Data Karyawan

Administrator dan HR dapat mengelola data karyawan melalui fitur:

- ➕ Tambah karyawan
- ✏️ Edit data karyawan
- 🗑️ Hapus data
- 🔎 Pencarian karyawan
- 🎯 Filter berdasarkan divisi
- 📌 Filter status
- 🟢 Aktif / Nonaktif
- 📄 Pagination data

Informasi karyawan dapat mencakup:

- ID karyawan
- Nama
- Email
- Nomor WhatsApp
- Divisi
- Jabatan
- Role
- Status karyawan

---

🌴 Manajemen Cuti

Karyawan dapat mengajukan cuti melalui sistem.

Informasi pengajuan meliputi:

- Jenis cuti
- Tanggal mulai
- Tanggal selesai
- Durasi cuti
- Alasan
- Status pengajuan

Alur cuti:

```text
Karyawan Mengajukan Cuti
        ↓
      Menunggu
        ↓
HR / Manager Review
        ↓
  Disetujui / Ditolak
        ↓
Saldo Cuti Diperbarui
````

Fitur cuti mencakup:

* Pengajuan cuti
* Riwayat cuti
* Saldo cuti
* Persetujuan
* Penolakan
* Catatan keputusan

---

📝 Manajemen Izin

Karyawan dapat mengajukan izin untuk kebutuhan tertentu.

Fitur izin meliputi:

* Tanggal izin
* Jenis izin
* Alasan
* Status pengajuan
* Riwayat izin
* Persetujuan
* Penolakan
* Catatan reviewer

---

⏱️ Manajemen Lembur

Karyawan dapat mengajukan lembur melalui sistem.

Informasi yang tersedia:

* Tanggal lembur
* Jam mulai
* Jam selesai
* Durasi otomatis
* Alasan lembur
* Status pengajuan
* Catatan persetujuan

Sistem juga dapat menampilkan:

* Total jam lembur
* Riwayat lembur
* Status pengajuan
* Approval lembur

---

✅ Persetujuan Terpadu

Sistem menyediakan halaman persetujuan terpusat untuk menangani:

* 🌴 Cuti
* 📝 Izin
* ⏱️ Lembur

Pengguna yang memiliki kewenangan dapat:

* Melihat seluruh pengajuan
* Memeriksa detail
* Menyetujui pengajuan
* Menolak pengajuan
* Memberikan catatan keputusan

Halaman ini membantu HR dan Manager mengelola proses approval tanpa harus membuka modul satu per satu.

---

🏢 Struktur Organisasi

Modul organisasi digunakan untuk menampilkan dan mengelola informasi struktur perusahaan.

Informasi dapat meliputi:

* Departemen
* Divisi
* Jabatan
* Atasan
* Jumlah anggota
* Struktur hubungan antarbagian

Fitur ini membantu visualisasi struktur organisasi secara lebih jelas.

---

📑 Laporan Kepegawaian

Sistem menyediakan laporan untuk membantu proses monitoring dan dokumentasi HR.

Laporan dapat mencakup:

* Data karyawan
* Cuti
* Izin
* Lembur
* Status pengajuan
* Rekap aktivitas
* Filter berdasarkan periode
* Filter berdasarkan divisi
* Filter berdasarkan status

---

📗 Export Data

Data laporan dapat diekspor untuk kebutuhan:

* 📊 Rekapitulasi
* 🗂️ Dokumentasi
* 📈 Analisis
* 🧾 Pelaporan
* 📁 Arsip HR

Format export dapat dikembangkan ke:

```text
.xlsx
.pdf
```

---

🔔 Sistem Notifikasi

Sistem dapat menampilkan notifikasi untuk aktivitas penting seperti:

* Pengajuan baru
* Perubahan status cuti
* Perubahan status izin
* Perubahan status lembur
* Approval tertunda
* Informasi sistem

Notifikasi membantu pengguna mengetahui perubahan tanpa harus membuka seluruh modul secara manual.

---

👤 Profil Pengguna

Setiap pengguna memiliki halaman profil untuk melihat informasi seperti:

* Nama
* Email
* Nomor WhatsApp
* Role
* Jabatan
* Divisi
* Status akun

---

⚙️ Pengaturan

Halaman pengaturan digunakan untuk mengelola preferensi pengguna dan sistem.

Contoh pengaturan:

* Preferensi notifikasi
* Pengaturan akun
* Preferensi sistem
* Pengaturan akses tertentu

---

🔐 Role-Based Access Control

Sistem memiliki beberapa role utama:

👑 Administrator

Administrator memiliki akses penuh ke:

* Dashboard
* Data Karyawan
* Cuti
* Izin
* Lembur
* Persetujuan
* Organisasi
* Laporan
* Profil
* Pengaturan

---

🧑‍💼 HR

HR memiliki akses untuk:

* Dashboard
* Data Karyawan
* Cuti
* Izin
* Lembur
* Persetujuan
* Organisasi
* Laporan
* Profil
* Pengaturan

---

👔 Manager

Manager memiliki akses yang berfokus pada:

* Dashboard
* Monitoring tim
* Persetujuan
* Cuti
* Izin
* Lembur
* Organisasi
* Profil
* Pengaturan

---

👨‍💻 Karyawan

Karyawan dapat:

* Melihat dashboard
* Melihat data pribadi
* Mengajukan cuti
* Mengajukan izin
* Mengajukan lembur
* Melihat status pengajuan
* Melihat riwayat
* Mengelola profil
* Mengatur preferensi akun

---

📲 Login Email / WhatsApp & OTP

Sistem menggunakan proses login berbasis:

```text
Email / Nomor WhatsApp
        ↓
Kirim OTP
        ↓
Verifikasi OTP
        ↓
Role Ditentukan
        ↓
Masuk Dashboard
```

Pada versi prototype, OTP digunakan sebagai simulasi autentikasi frontend.

---

🔒 Keamanan Akses

Sistem dilengkapi dengan:

* 🔐 Login
* 📲 OTP Verification
* 🛡️ Protected Route
* 👥 Role-Based Access Control
* 🚫 Halaman 403 Akses Ditolak
* 🔍 Halaman 404 Tidak Ditemukan
* 🚪 Logout
* 💾 Session berbasis LocalStorage

Pengguna yang mencoba membuka halaman di luar hak akses akan diarahkan sesuai role atau menuju halaman akses ditolak.

---

📱 Responsive Design

Sistem Kepegawaian Digital dirancang agar nyaman digunakan pada:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Tablet
* 📲 Smartphone

Fitur responsive meliputi:

* ☰ Mobile Sidebar
* 📋 Responsive Table
* 📊 Responsive Dashboard
* 🧾 Responsive Form
* 🔔 Responsive Notification
* 👤 Responsive Profile Dropdown
* 📱 Mobile-Friendly Navigation

---

💾 LocalStorage

Project menggunakan `localStorage` untuk menyimpan data simulasi seperti:

* Session login
* Data karyawan
* Pengajuan cuti
* Pengajuan izin
* Pengajuan lembur
* Status approval
* Preferensi pengguna

Dengan demikian, sebagian data demo dapat tetap tersedia setelah halaman direfresh.

---

🛠️ Teknologi yang Digunakan

* ⚛️ React
* 🔷 TypeScript
* ⚡ Vite
* 🎨 Tailwind CSS
* 🧭 React Router
* 🐻 Zustand
* 📊 Recharts
* 🎯 Lucide React
* 📗 SheetJS / XLSX
* 📄 PDF Export Library
* 💾 LocalStorage
* 🐙 GitHub
* ▲ Vercel

---

🚀 Menjalankan Project

Clone repository:

```bash
git clone https://github.com/khalilurrahmanmahdi12/sistem_kepegawaian.git
```

Masuk ke folder project:

```bash
cd sistem_kepegawaian
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

---

🌐 Deployment

Project dideploy menggunakan *Vercel*.

Live application:

```text
https://sistem-kepegawaian-chi.vercel.app/
```

Untuk aplikasi React Router SPA, project dapat menggunakan konfigurasi `vercel.json` seperti:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Konfigurasi ini memastikan route aplikasi tetap dapat dibuka langsung dan tidak mengalami 404 ketika halaman direfresh.

---

📂 Struktur Utama Project

```text
src/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── navigation/
│   └── ui/
│
├── context/
├── data/
├── layouts/
│
├── pages/
│   ├── admin/
│   ├── manager/
│   ├── hr/
│   └── karyawan/
│
├── store/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

---

📌 Status Project

✅ Login Email / WhatsApp
✅ OTP Demo
✅ Role-Based Access Control
✅ Dashboard Kepegawaian
✅ Manajemen Karyawan
✅ Pengajuan Cuti
✅ Saldo Cuti
✅ Pengajuan Izin
✅ Pengajuan Lembur
✅ Perhitungan Durasi Lembur
✅ Persetujuan Terpadu
✅ Struktur Organisasi
✅ Laporan Kepegawaian
✅ Profil Pengguna
✅ Pengaturan
✅ Protected Route
✅ Halaman 403
✅ Halaman 404
✅ Responsive Design
✅ LocalStorage
✅ Deployment Vercel

---

🔮 Pengembangan Selanjutnya

Sistem masih dapat dikembangkan dengan:

* 🗄️ Backend REST API
* 🐬 MySQL / PostgreSQL
* 🔐 Server-side Authentication
* 📲 OTP WhatsApp asli
* 👥 User Management
* 🕒 Sistem Absensi
* 📍 GPS Attendance
* 📸 Face Recognition Attendance
* 💰 Payroll
* 🧾 Slip Gaji
* 🎯 KPI & Performance Management
* 📝 Recruitment Management
* 🎓 Training Management
* 📧 Email Notification
* 💬 WhatsApp Notification
* 🔔 Real-Time Notification
* 📄 Export PDF
* 📊 Advanced HR Analytics
* 🔐 SSO / Active Directory

---

🎯 Tujuan Project

Project ini dibuat untuk menunjukkan kemampuan dalam membangun aplikasi HRIS dengan:

* Modern UI/UX
* Responsive Web Design
* State Management
* Client-Side Routing
* Role-Based Access Control
* CRUD Data
* Leave Management
* Permission Management
* Overtime Management
* Approval Workflow
* Organizational Management
* Reporting
* Data Visualization
* Deployment Production

---

⚠️ Catatan

*Sistem Kepegawaian Digital merupakan prototype/demo portfolio.*

Data yang digunakan merupakan **data simulasi**, bukan data karyawan perusahaan asli.

Fitur login, OTP, approval, cuti, izin, lembur, serta penyimpanan data pada versi saat ini masih menggunakan simulasi frontend dan LocalStorage.

Project ini masih dapat dikembangkan menjadi HRIS production dengan backend, database, autentikasi server, payroll, absensi, dan integrasi sistem perusahaan.

---

👨‍💻 Developer

*Khalilurrahman Mahdi*

Software Engineer / Full-Stack Developer

🔗 GitHub
[https://github.com/khalilurrahmanmahdi12](https://github.com/khalilurrahmanmahdi12)

---

⭐ Repository

Jika project ini menarik, jangan lupa kasih ⭐ pada repository.

🔗 **Sistem Kepegawaian Digital**
[https://github.com/khalilurrahmanmahdi12/sistem_kepegawaian](https://github.com/khalilurrahmanmahdi12/sistem_kepegawaian)
