# Piano Path

Website modul piano Bahasa Indonesia: 8 tahap, 24 chapter, 40 soal, tugas praktik, serta studio interaktif. HTML/CSS/JavaScript tanpa build dan tanpa library frontend.

## Menjalankan

`python -m http.server 4173` lalu buka http://localhost:4173. Jalankan `node tests.mjs` untuk pemeriksaan logika progres dan penilaian. GitHub Actions menjalankan pemeriksaan ini sebelum deploy Pages.

## Model akses

Materi, keyboard dua oktaf, akor/inversi, progresi, metronom, ketukan, baca not, latihan telinga, dan perekam tersedia bagi tamu. Tamu tidak menyimpan progres. Password diverifikasi di Supabase Edge Function; sesi tersimpan di memori halaman selama maksimal 8 jam. Refresh meminta login kembali. Satu password mengakses satu profil, termasuk pada perangkat berbeda.

Syarat lulus: chapter lengkap, checklist lengkap, kuis >=80%, praktik dikonfirmasi, seluruh rubrik >=3/5. Penilaian permainan adalah evaluasi mandiri, bukan pengenalan audio atau sertifikasi ahli. Server memeriksa urutan tahap dan menghitung nilai kuis. Nilai kuis terbaik dipertahankan. Kelulusan yang sudah dicapai tidak dapat diturunkan melalui checklist/evaluasi; catat penilaian lanjutan di jurnal.

Database menggunakan RLS tanpa akses langsung dari anon/authenticated. Server memegang service role melalui environment bawaan, password PBKDF2 SHA-256 bersalt (210.000 iterasi), sesi token acak yang hanya disimpan sebagai hash, serta batas 10 percobaan login/15 menit/IP. `config.js` hanya memuat endpoint dan publishable key publik. Jangan commit password, hash password, token sesi, atau service role.

## Deploy ulang

Repository publik `Rinodu/piano-path`, GitHub Pages memakai workflow `.github/workflows/pages.yml`. File relatif membuat website kompatibel dengan subpath Pages. Artifact publik hanya enam file frontend dan `.nojekyll`, tidak mencakup kode server atau tes.

Backend: `backend/schema.sql`, `backend/index.ts`, `backend/progress.js`, dan `course.js`. Function `piano-api` menggunakan verifikasi sesi sendiri, sehingga gateway `verify_jwt=false`. Deploy semua file dengan susunan direktori dipertahankan. Provision satu baris `piano_access` secara privat. Password dapat diganti dengan salt dan hash baru lalu menghapus sesi lama. Layanan diperlukan untuk progres; materi tetap berjalan ketika backend tidak tersedia.

## Batasan yang disengaja

- Keyboard memakai sintesis harmonik, bukan sampel grand piano.
- Perekam memakai mikrofon lokal, maksimum 10 menit; unduh sebelum pindah halaman. Audio tidak diunggah.
- Skor ritme memperkirakan ketepatan tap dan dipengaruhi latensi perangkat. Ini alat latihan, bukan pengukuran profesional.
- Cadangan JSON menggabungkan pencapaian dan jurnal maksimal 1000 catatan; hasil impor adalah deklarasi pengguna.
- Progres memakai versi optimistis agar dua perangkat tidak saling menimpa. Jika konflik, muat ulang data dan ulangi tindakan.
- Google Fonts opsional; font sistem tetap tersedia jika offline.
