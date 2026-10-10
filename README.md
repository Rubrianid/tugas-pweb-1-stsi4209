# SITTA UT — Sistem Informasi Tiras & Transaksi Bahan Ajar

Tugas 1 — Pemrograman Berbasis Web (STSI4209)

Aplikasi web untuk pengelolaan informasi bahan ajar Universitas Terbuka.

## Identitas Tugas

| Keterangan | Detail |
|------------|--------|
| **Nama** | Muhammad Febrian Romadhoni Saputra |
| **NIM** | 056330525 |
| **Program Studi** | S1 / Sistem Informasi |
| **Fakultas** | Sains dan Teknologi |
| **UPBJJ / UT Daerah** | Surabaya |
| **Nama / Kode Mata Kuliah** | Pemrograman Berbasis Web I / STSI4209 |
| **Kode Kelas** | 101 |

## Fitur
- **Login** (autentikasi sederhana berbasis `data.js`)
- **Dashboard** (ringkasan stok, DO aktif, navigasi cepat)
- **Informasi Bahan Ajar** (tabel stok, tambah data, detail modal)
- **Tracking Pengiriman** (lacak nomor DO + timeline perjalanan paket)

## Teknologi
- HTML, CSS, JavaScript (vanilla)
- SweetAlert2 (notifikasi)
- Font Awesome (ikon)

## Akun Demo
| Email | Password | Role |
|-------|----------|------|
| `rina@ut.ac.id` | `rina123` | UPBJJ Jakarta |
| `admin@ut.ac.id` | `admin123` | Administrator |

## Struktur Folder
```
SITTA-UT/
├── index.html        # Halaman login
├── dashboard.html    # Dashboard utama
├── stok.html         # Informasi bahan ajar
├── tracking.html     # Tracking pengiriman
├── css/style.css     # Styling
├── js/data.js        # Data dummy
├── js/script.js      # Logika aplikasi
└── img/              # Gambar (logo & cover buku)
```

## Menjalankan
Buka `index.html` di browser, atau deploy ke Vercel / static hosting.
