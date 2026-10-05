# Audit Piano Path — kurikulum 2026

## Temuan awal dan keputusan

Repo awal memiliki 8 tahap, 24 chapter pendek (tiga paragraf inti per chapter), 40 soal, satu proyek/rubrik per tahap. Ada piano 25/88 tuts, velocity tiga lapisan, contoh tuts menyala, loop potongan latihan, metronom/tap, kuis kunci G/F, telinga mayor/minor, tantangan nada/akor, Web MIDI, pemutar MIDI lokal dengan track/tempo/seek/ulang, mikrofon lokal, jurnal dan target.

Kekurangan: tahap teknik/harmoni tidak mengikuti peta baru; telinga/sight-reading/memori belum menjadi tahap tersendiri; tiga jalur hanya satu chapter masing-masing; latihan/rubrik belum hadir pada setiap chapter. Banyak subtopik belum dijelaskan (jenis instrumen/pedal, meter 2/4/3/4, tie vs slur, tiga minor, kromatis, semua tonalitas, diminished/augmented, kadens, sus/add/extensions, pola Alberti, memori multimodal, metode latihan, comping/modal/reharmonisasi). Status membaca/checklist dan empat rubrik terlalu umum untuk menyatakan penguasaan baru.

Materi lama yang benar dipakai kembali dalam chapter baru. ID, urutan, API/backend, cadangan, serta pencapaian lama dipertahankan. Semua topik tambahan mempunyai penjelasan/contoh dan latihan; seluruh 36 chapter memakai format 14 bagian yang diminta. Peta prasyarat terletak dalam `curriculum.js`; status bukti dihitung dalam `curriculum-progress.js`.

## Cakupan yang dapat langsung digunakan

| Bagian | Chapter | Bukti akhir |
| --- | --- | --- |
| 1. Orientasi/fondasi | Instrumen & tubuh; tuts/oktaf/jari; pulsa/melodi | Nada beberapa register, pola tiap tangan, pulsa, refleksi kenyamanan |
| 2. Notasi/ritme | Dua kunci; meter/nilai; simbol & membaca baru | Baca melodi baru, tepuk diam/subdivisi, mainkan dari notasi |
| 3. Koordinasi | Titik temu/arah; melodi/pengiring; artikulasi/pemulihan | Karya dua tangan, keseimbangan, sambungan stabil |
| 4. Teknik | Mayor semua tonalitas; minor/kromatis/arpeggio; perpindahan/teknik spesifik | Penjarian, bunyi rata, kualitas dan penerapan pada karya |
| 5. Harmoni | Interval/akor; fungsi/kadens/voice leading; lead sheet/pola/transposisi | Pengiring dari melodi/akor, beberapa tonalitas, fungsi |
| 6. Musikalitas | Frase/voicing; pedal; rubato/interpretasi | Karya terencana, bunyi bersih, alasan interpretasi |
| 7. Telinga/membaca/memori | Interval/meniru; baca baru/transposisi; memori/jangkar | Pola baru, beberapa titik awal, analisis sederhana |
| 8. Repertoar/latihan | Diagnosis; metode potongan; jadwal/program | Beberapa karya utuh berbeda karakter, sebelum/sesudah |
| Klasik | Gaya/bentuk; polifoni/ornamen; resital/ensemble | Program pilihan dan umpan balik manusia |
| Pop | Groove/chart; aransemen; reharmonisasi/medley | Aransemen pribadi, transposisi, kerja sama |
| Jazz | Swing/blues; ii–V–I/voicing; improvisasi/modal/ensemble | Bentuk, motif, komunikasi dan umpan balik |
| Pendalaman | Teknik individual; analisis/karya kreatif; portofolio | Satu jalur, tiga pengambilan hari berbeda, evaluasi berkala |

Ada 36 demo chapter, 12 kartu baca 4 birama, 12 étude mini 8 birama, 12 miniatur utuh 12/16/32 birama. Notasi, pola lengkap setiap birama, tujuan, prasyarat, penjarian awal, bagian sulit, metode, audio/tuts, MIDI dan rubrik tersedia. Variasi acak terpisah menghindari tes sight-reading memakai demo hafalan. Komposisi/partitur/MIDI baru orisinal CC BY 4.0; sampel audio CC BY 3.0 dengan atribusi terpisah. Tidak menyalin lagu atau materi berbayar.

## Pengantar dan kompetensi yang tetap membutuhkan manusia

Kurikulum inti memberikan langkah belajar dan tugas yang dapat dilakukan. Teks jalur/lanjut menjelaskan prinsip dan contoh konkret, tetapi materi berikut merupakan pengantar: analisis sonata lengkap, ornamentasi historis rinci, teknik oktaf/double notes cepat, tekstur lanjut/poliritme, rootless/altered voicings semua tonalitas, modal jazz, reharmonisasi lanjut, dan interpretasi repertoar kompleks. Pendalaman harus memakai partitur/repertoar tambahan berizin serta kebutuhan individu. Miniatur orisinal jalur/lanjut adalah bahan studi pengantar, bukan paket repertoar expert.

Penjarian untuk semua mayor diberikan satu oktaf naik; sambungan multioktaf serta arpeggio semua tonalitas harus direncanakan bersama pengajar sesuai karya. Petunjuk tempo bukan standar kelulusan universal. Notasi bantu SVG memakai 4/4 (3/4 untuk demo meter) dan ejaan kres berdasarkan MIDI; teks menunjukkan ejaan enharmonik serta durasi. Ini belum pengganti edisi partitur profesional lengkap dengan seluruh tanda ekspresi/ornamen.

Penilaian otomatis lama hanya mengukur set nada dan estimasi waktu tap; tidak mengevaluasi permainan karya utuh. MIDI tidak memastikan postur/ketegangan/interpretasi/teknik fisik. Mikrofon hanya merekam lokal, belum pitch detection. Rubrik baru adalah penilaian diri atau umpan balik pengajar yang dicatat pengguna, tanpa verifikasi identitas. Tahap lanjut meminta tiga tanggal berbeda dan jumlah pengambilan yang cocok; file rekaman tidak diunggah/diverifikasi. Tidak ada gelar expert otomatis.

Mode tunggu nada adaptif, filter tangan pada lagu MIDI, loop A–B file MIDI, penilaian ritme karya penuh, dan sinkronisasi akun pengajar belum ditambahkan. Loop potongan pada contoh dan tantangan menunggu jawaban nada yang sudah tersedia tetap dipakai. Fitur tambahan tersebut opsional dalam prompt dan tidak diperlukan untuk mengakses materi.

## Penyimpanan dan kompatibilitas

Record v2 ditambahkan ke jurnal yang sudah diterima API, maksimal 2000 karakter per catatan. Satu record berisi aktivitas/kuis/evaluasi; rekaman tetap lokal. Catatan metadata tidak dihitung sebagai sesi/menit latihan. Penilaian terbaru menunjukkan kondisi saat ini; bukti lama dan pencapaian v1 tetap utuh. Seluruh syarat kompetensi baru dihitung dari bukti baru, tanpa mengubah checkbox lama menjadi penguasaan baru.

Simpan chapter mengirim record sesi satu per satu. Bila login ditutup, jaringan gagal, atau konflik versi, catatan belum tersimpan tetap di memori dan dapat dicoba lagi. Refresh menghapus catatan sesi yang belum disimpan; pemberitahuan terlihat pada halaman. Cadangan v1 tetap membawa jurnal termasuk record v2. Batas 1000 catatan backend tetap berlaku; ekspor melalui jurnal bila mendekati batas.

## Verifikasi

- `npm test`: progres/gate v1, parser MIDI, 36 chapter/12 kelompok/96 contoh, MIDI roundtrip semua demo/karya, rubrik/sumber/tanggal/prasyarat, status membaca/coba terpisah, pelestarian stages v1, impor/ekspor dan metadata tidak dihitung sebagai menit latihan.
- Browser desktop dan 390px: seluruh 36 rute, kuis serta rubrik tamu tanpa jaringan/login, tuts/audio/stop, unduhan MIDI, variasi baru, catatan database simulasi, pembacaan jurnal, dan perilaku refresh.
- Browser studio: layer audio asli, MIDI simulasi velocity/note/pedal/hotplug/mute, tantangan akor, tempo/loop potongan, glissando mouse/sentuh, sustain, piano 88 tuts dan ekstrem, pemutar MIDI lokal (track/seek/tempo/ulang), 96 pilihan audio/highlights/stop.
- Lingkungan browser pada host ini mengembalikan HTTP 204 kosong untuk MP3 meskipun GET server mengembalikan file asli. Tes browser memasok byte MP3 asli dari repo melalui route Playwright; decoding/audio/scheduling tetap nyata. Ini memverifikasi aset dan logika playback, bukan kondisi jaringan perangkat pengguna.
- Password/database produksi, perangkat MIDI fisik, izin mikrofon nyata, half-pedal dan penilaian teknik tubuh tidak diuji. Database diuji melalui backend simulasi menggunakan `mutateProgress` yang sama; backend produksi tidak diubah.

GitHub Pages packaging menyertakan semua modul baru; pemeriksaan kurikulum ditambahkan sebelum deploy. Perubahan diajukan di branch/PR agar dapat ditinjau sebelum masuk ke situs produksi.
