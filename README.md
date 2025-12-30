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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## dependencies need to be installed :

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

## Detail Video Course
### Full Stack JavaScript MERN - SiakadCloud
👉 [Link](https://buildwithangga.com/kelas/full-stack-javascript-mern-2026-sistem-informasi-akademik)

Bagian ini berisi **rincian materi dan implementasi video course** pada kelas  
**Full Stack JavaScript MERN – Sistem Informasi Akademik (SiakadCloud)**.  
Setiap poin merepresentasikan **pembahasan teknis per video / sesi pembelajaran**.

---

### Penerapan API ADMIN
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

#### Clone Components
##### Komponen Table
- DataTable — bagian utama tabel
- TablePagination — bagian halaman tabel
- TableToolbar — bagian search

##### Komponen Form
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

### Role DOSEN dan MAHASISWA
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

#### Mahasiswa Feature dan Penerapan Komponen
- Tambah API ke KHS
- Tambah API ke Payment
- Fix add KRS
- Fix payment warning

### Page Start
- Tambah route
- Perbaiki layout sidebar

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