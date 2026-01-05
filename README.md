This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Dependencies need to be installed :

yarn add \
@radix-ui/react-dialog \
@radix-ui/react-popover \
@tanstack/react-table \
@ui-kitten/components \
clsx \
date-fns \
dayjs \
html2canvas \
jspdf \
lucide-react \
react-day-picker \
react-select \
react-spinners \
select2 \
tailwind-variants \
moment \
react-big-calendar \
highcharts \
highcharts-react-official \
jose

yarn add -D @types/react-big-calendar @types/highcharts

---
## Video Course materials

Bagian ini berisi **rincian materi dan implementasi video course** pada kelas  
**Full Stack JavaScript MERN 2026 – Sistem Informasi Akademik (SiakadCloud)**.  
Setiap poin merepresentasikan **pembahasan teknis per video / sesi pembelajaran**.
Link pembelian [Link](https://buildwithangga.com/kelas/full-stack-javascript-mern-2026-sistem-informasi-akademik)

---
### Penerapan API - ADMIN
---
#### Master Data
- Fakultas
- Prodi
- Tahun Ajaran
- Golongan UKT
- Dosen
- Kelas
- Mahasiswa
- UKT
- Mata Kuliah
- Jadwal
- KRS
- KHS
- Pembayaran
- Users
- TimeLine

#### Komponen Table
- DataTable — bagian utama tabel
- TablePagination — bagian halaman tabel
- TableToolbar — bagian search

#### Komponen Form
- AddForm — untuk create data
- EditForm — untuk update data

#### Implementasi Komponen
- ke Fakultas
- ke Prodi
- ke Tahun Ajaran
- ke Kelas
- ke Mahasiswa
- ke Dosen
- ke Tahun Ajaran
- ke Mata Kuliah
- ke Jadwal
- ke Time Line
- ke UKT
- ke Golongan UKT
- Tambah Komponen Detail untuk KRS dan KHS
- Implementasi ke KRS
- Implementasi ke KHS
- Upgrade komponen Detail untuk download PDF dan implementasi ke KRS dan KHS

#### Bug Fix
- Tambah loading di semua page admin
- Perbaiki Hydranation
- Perbaiki type any
- Hapus import yang tidak terpakai
- Hapus package yang tidak terpakai

---
### Penerapan API - DOSEN
---
#### Dosen Feature dan Penerapan Komponen
- Tambah komponen kalender dan implementasi
- Tambah interface KRS pakai DetailForm
- Tambah komponen absensi toggle
- Tambah komponen MatkulCard
- Integrasi API dan komponen pada Mata Kuliah
- Tambah API untuk pilih kelas
- Fix search params
- Fix ascending dan status
- Tambah API ke Jadwal

---
### Penerapan API - MHS
---
#### Mahasiswa Feature dan Penerapan Komponen
- Tambah API ke KHS
- Tambah API ke Payment
- Fix add KRS
- Fix payment warning

#### Page Start
- Tambah route
- Perbaiki layout sidebar

---
### FINALIZATION
---
### Dashboard
- Tambah dashboard dosen dan komponen terkait
- Tambah dashboard admin dan komponen terkait
- Tambah dashboard mahasiswa dan komponen terkait

### Perbaikan Detail
- Hapus ikon yang tidak penting

### Role Check
- Tambah middleware untuk cek role dan forbidden page

### Midtrans
- Integrasi API Midtrans