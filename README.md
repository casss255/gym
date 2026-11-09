# Gym Program (PWA)

App program gym untuk iPhone: animasi cara gerakan, pencatat beban dan repetisi, timer istirahat, dan riwayat latihan. Semua file total kurang dari 100 KB.

## Upload ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `gym`, dengan pilihan **Public**.
2. Klik **Add file → Upload files**, lalu upload semua file di folder ini (index.html, sw.js, manifest.webmanifest, dan 3 file PNG). Klik **Commit changes**.
3. Buka **Settings → Pages**. Di bagian *Branch*, pilih `main` dan folder `/ (root)`, lalu **Save**.
4. Tunggu 1–2 menit. Alamat app: `https://USERNAME.github.io/gym/`

## Pasang di iPhone

1. Buka alamat di atas lewat **Safari**.
2. Tekan tombol **Share**, lalu **Add to Home Screen**.
3. Buka dari icon di Home Screen. Setelah dibuka sekali saat online, app tetap jalan offline.

## Update app

Ubah `index.html`, lalu di `sw.js` naikkan versinya (misalnya `gym-v1` menjadi `gym-v2`). Upload ulang kedua file. Di iPhone, tutup dan buka app 1–2 kali.

## Catatan

- Data latihan tersimpan di iPhone masing-masing. Menghapus icon dari Home Screen ikut menghapus data.
- Bunyi timer tidak terdengar kalau iPhone dalam mode senyap.
- Program dan gerakan bisa diubah di bagian `EX` dan `PROGRAMS` di dalam `index.html`.
