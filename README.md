# Piano Path

Website belajar piano Bahasa Indonesia: kurikulum baru dengan 8 tahap inti, 3 jalur, pendalaman menuju expert, 36 chapter, 108 pertanyaan kuis (36 khusus materi dan 72 tentang bukti/latihan aman), 7 aspek rubrik deskriptif, serta 36 bahan repertoar orisinal. HTML/CSS/JavaScript tanpa build dan tanpa library frontend. Seluruh 24 chapter, 40 soal, dan pencapaian versi lama tetap tersedia melalui tautan arsip.

## Kurikulum dan bukti kompetensi

Beranda menampilkan peta prasyarat; `#learn/foundation/instrument` memulai kurikulum. `#plan` menyediakan sesi 15/30/60 menit termasuk istirahat dan musik favorit. Semua chapter memiliki kompetensi, prasyarat, penjelasan, istilah, pola/penjarian, audio/tuts menyala, latihan terpandu dan mandiri, kesalahan/perbaikan, tugas, kuis dengan penjelasan, rubrik, syarat lanjut, dan pengulangan. Studio yang sudah tersedia dipakai kembali.

Catatan dibaca, dicoba, kuis, dan evaluasi berbeda. Tidak ada tombol aktivitas yang meluluskan praktik. Kompetensi membutuhkan kuis >=80%, tugas/bukti, seluruh 7 aspek >=3, dan prasyarat. Sumber rubrik adalah penilaian diri atau umpan balik pengajar yang **dilaporkan pengguna**; identitas pengajar tidak diverifikasi. Jalur dan pendalaman membutuhkan umpan balik manusia; pendalaman juga membutuhkan salah satu jalur dan minimal 3 rekaman utuh pada hari berbeda. Keahlian expert tidak ditentukan oleh jumlah chapter, tempo, atau skor.

Catatan baru menggunakan ID chapter stabil serta record berawalan `[PIANO-PATH-CURRICULUM-V2]` di jurnal API yang sudah terpasang. Tidak perlu migrasi SQL/deploy backend untuk integrasi ini. Field stages, pencapaian, dan jurnal v1 tidak ditulis ulang; cadangan lama tetap diterima. Catatan kompetensi tidak dihitung sebagai menit/sesi latihan. Pembacaan v2 memvalidasi bentuk record, jawaban kuis, rubrik, dan tanggal. Ini tetap deklarasi pengguna, bukan sertifikat server. Penilaian terbaru menentukan kompetensi sekarang, sementara bukti sebelumnya tetap ada.

Tamu dapat memeriksa hasil dan rubrik tanpa login. Catatan sesi berada di memori halaman sampai refresh. Tombol simpan meminta password dan menulis catatan chapter saat ini satu per satu; bila sebagian gagal, sisanya tetap di sesi. Untuk menyimpan durasi latihan sebenarnya, isi jurnal sesi biasa. Ekspor database menggunakan format cadangan v1 yang sama, termasuk record kurikulum.

Ada 96 pilihan player: 24 contoh lama, 36 demo chapter, dan 36 bahan repertoar (kartu membaca 4 birama, étude mini 8, miniatur utuh 12/16/32). MIDI komposisi orisinal dibuat lokal dan dapat dibuka di pemutar studio. Variasi membaca baru dibuat sebelum audio untuk memisahkan membaca dari menghafal. Notasi SVG bantu tinggi/durasi memakai ejaan kres nomor MIDI; contoh teks mengajarkan ejaan musik dalam konteks. Penjarian tertulis adalah usulan dan tidak boleh dipaksakan. Komposisi/partitur/MIDI baru CC BY 4.0, atribusi Piano Path — Studi Kurikulum 2026; sampel tetap CC BY 3.0 sesuai kredit terpisah.

Lihat [audit kurikulum](CURRICULUM-AUDIT.md) untuk batas cakupan dan verifikasi. Bentuk sonata, ornamentasi historis, rootless/altered voicings, modal jazz, reharmonisasi lanjut, teknik oktaf/double notes, dan interpretasi kompleks adalah **pengantar pendalaman**. Studi orisinal jalur/lanjut merupakan bahan kerja, belum koleksi repertoar expert. Tugas tahap ini meminta repertoar berizin tambahan sesuai individu dan evaluasi pengajar; website tidak menjanjikan expert setelah selesai.

## Memeriksa perubahan

`npm test` menjalankan pemeriksaan v1, parser MIDI, dan kurikulum/bukti/cadangan. `npm run test:browser` memerlukan Playwright serta browser terpasang; gunakan `PIANO_URL`, `PIANO_BROWSER_CHANNEL`, atau `PIANO_BROWSER_EXECUTABLE` untuk lingkungan yang berbeda. Tes browser memeriksa 36 rute, tamu, audio, file MIDI, piano 25/88 tuts, MIDI simulasi, mobile, dan backend simulasi. Tes tidak memakai password produksi atau menguji perangkat MIDI/mikrofon fisik.

## Menjalankan

`python -m http.server 4173` lalu buka http://localhost:4173. Jalankan `node tests.mjs` untuk pemeriksaan logika progres dan penilaian. GitHub Actions menjalankan pemeriksaan ini sebelum deploy Pages.

Keyboard mendukung pointer drag/glissando dan sentuhan. Sustain tetap aktif ketika berpindah tab browser atau halaman modul; sampel tetap meluruh alami. Nonaktifkan checkbox sustain untuk melepas bunyi. `node tests-input.cjs` menguji drag mouse/sentuh dan perpindahan tab dengan Playwright (jika tersedia di lingkungan pengujian). Gunakan `PIANO_URL` untuk menguji situs publik; default localhost:4173.

## Latihan interaktif

- 24 contoh khusus chapter dari `exercises.js`; tuts panduan mengikuti ritme, durasi, bas/melodi, dan dinamika.
- Player dapat memilih langkah awal/akhir, tempo 30–200 BPM, jumlah putaran, dan kenaikan tempo per putaran. Kenaikan merupakan demonstrasi terjadwal, bukan klaim kelulusan.
- Tantangan urutan nada, nada acak, dan akor memeriksa input virtual/komputer/MIDI. Kesalahan tidak mengubah target; tuts harus dilepas sebelum percobaan berikutnya. Hasil bisa dicatat ke jurnal setelah login.
- Web MIDI memakai izin `requestMIDIAccess({sysex:false})`, pemilihan input, hotplug, note-on/off, velocity, pedal CC64, dan opsi mematikan suara website. Perangkat fisik dan browser harus kompatibel. MIDI dibersihkan saat meninggalkan studio.
- Target mingguan 1–7 sesi dan 10–1000 menit disimpan melalui backend yang sama. Ringkasan menghitung jurnal pada minggu mulai Senin zona Asia/Jakarta; saran tugas mengikuti chapter, kuis, dan rubrik yang belum terpenuhi. Mode tamu menampilkan contoh rencana tanpa menulis data.

## Model akses

Materi, keyboard dua oktaf, akor/inversi, progresi, metronom, ketukan, baca not, latihan telinga, dan perekam tersedia bagi tamu. Tamu tidak menyimpan progres. Password diverifikasi di Supabase Edge Function; sesi tersimpan di memori halaman selama maksimal 8 jam. Refresh meminta login kembali. Satu password mengakses satu profil, termasuk pada perangkat berbeda.

Syarat lulus versi lama: chapter lengkap, checklist lengkap, kuis >=80%, praktik dikonfirmasi, seluruh rubrik >=3/5. Penilaian permainan adalah evaluasi mandiri, bukan pengenalan audio atau sertifikasi ahli. Server memeriksa urutan tahap dan menghitung nilai kuis. Nilai kuis terbaik dipertahankan. Kelulusan yang sudah dicapai tidak dapat diturunkan melalui checklist/evaluasi; catat penilaian lanjutan di jurnal.

Database menggunakan RLS tanpa akses langsung dari anon/authenticated. Server memegang service role melalui environment bawaan, password PBKDF2 SHA-256 bersalt (210.000 iterasi), sesi token acak yang hanya disimpan sebagai hash, serta batas 10 percobaan login/15 menit/IP. `config.js` hanya memuat endpoint dan publishable key publik. Jangan commit password, hash password, token sesi, atau service role.

## Deploy ulang

Repository publik `Rinodu/piano-path`, GitHub Pages memakai workflow `.github/workflows/pages.yml`. File relatif membuat website kompatibel dengan subpath Pages. Artifact publik file frontend, sampel piano, dan `.nojekyll`, tidak mencakup kode server atau tes.

Backend: `backend/schema.sql`, `backend/index.ts`, `backend/progress.js`, dan `course.js`. Function `piano-api` menggunakan verifikasi sesi sendiri, sehingga gateway `verify_jwt=false`. Deploy semua file dengan susunan direktori dipertahankan. Provision satu baris `piano_access` secara privat. Password dapat diganti dengan salt dan hash baru lalu menghapus sesi lama. Layanan diperlukan untuk progres; materi tetap berjalan ketika backend tidak tersedia.

## Batasan yang disengaja

- Keyboard dan seluruh latihan piano memakai 90 sampel Salamander Grand Piano oleh Alexander Holm (CC BY 3.0), sekitar 4,5 MB, dengan tiga lapisan rekaman dinamika. Kredit, sumber, dan perubahan format ada di `samples/ATTRIBUTION.md`. Playback rate mengisi nada di antara sampel; versi web memakai tiga dari 16 lapisan, bukan seluruh velocity/resonance library.
- Perekam memakai mikrofon lokal, maksimum 10 menit; unduh sebelum pindah halaman. Audio tidak diunggah.
- Skor ritme memperkirakan ketepatan tap dan dipengaruhi latensi perangkat. Ini alat latihan, bukan pengukuran profesional.
- Cadangan JSON menggabungkan pencapaian dan jurnal maksimal 1000 catatan; hasil impor adalah deklarasi pengguna.
- Progres memakai versi optimistis agar dua perangkat tidak saling menimpa. Jika konflik, muat ulang data dan ulangi tindakan.
- Google Fonts opsional; font sistem tetap tersedia jika offline.
`node tests-learning.cjs` memeriksa 24 player chapter, penilaian nada/akor, tiga layer sampel, loop dan kenaikan tempo, MIDI simulasi, serta tampilan mobile. Memerlukan Playwright yang tersedia di lingkungan pengujian; `PIANO_URL` dapat menunjuk situs publik.

Piano kini tersedia langsung pada setiap chapter sebagai panel yang bisa dilipat. Pilih 25 atau 88 tuts (A0–C8); slider menggeser rentang, tombol C tengah memusatkan tampilan, dan oktaf keyboard komputer dapat diganti. Semua nada 88 tuts memiliki sampel terdekat maksimal satu semitone, dalam tiga lapisan velocity.

Pemutar MIDI di studio membaca file lokal format 0/1, PPQN/SMPTE, running status, perubahan tempo, velocity dan sustain CC64. Kontrol: putar/jeda/stop, seek, kecepatan 50–150%, track melodis, ulang, dan ikuti tuts. Nada lagu terpisah dari input permainan manual sehingga bisa bermain bersama. File tidak diunggah. Batas: 5 MB, 100.000 event, 20.000 nada, 60 menit. Drum, program changes dan pitch bend tidak diterapkan; semua track melodis memakai grand piano.

`node tests-midi.mjs` memeriksa parser tanpa dependensi. `node tests-song.cjs` memeriksa interaksi pemutar/88 tuts/piano chapter dengan Playwright; mendukung `PIANO_URL`.

## Lagu sesuai tahap

Setiap tahap/jalur memiliki tiga pilihan lagu dengan versi/aransemen, tujuan, kesiapan, bagian sulit, tugas/rubrik, dan sumber partitur. Penempatan adalah rekomendasi pedagogis, bukan padanan grade. Contoh: tahap 1 Hot Cross Buns/Mary Had a Little Lamb/tema Ode to Joy; menengah menuju Burgmüller, Schumann, Clementi dan Chopin; jalur pop memakai edisi easy piano berizin, jazz menggunakan blues serta lead sheet standar. Lagu eksternal tidak otomatis tersedia di player. Tiga susunan melodi pemula tersedia sebagai audio/tuts/MIDI lokal (total 99 pilihan player), dibuat dari melodi tradisional/tema Beethoven, tanpa menyalin aransemen modern. Buka detail lagu untuk pola lengkap/penjarian. Komposisi, edisi, aransemen dan rekaman mempunyai hak terpisah.
