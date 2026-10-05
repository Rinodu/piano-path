# Piano sample attribution

Salamander Grand Piano by **Alexander Holm**, sampled Yamaha C5 grand piano.

License: [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).
Original library: https://archive.org/details/SalamanderGrandPianoV3
Project and license: https://github.com/sfzinstruments/SalamanderGrandPiano

These 90 stereo MP3 files are derived from the original FLAC samples at velocity layers **v4 (soft), v8 (medium), v12 (loud)**:
https://github.com/sfzinstruments/SalamanderGrandPiano/tree/3382bf9496bba2486f5ab0de55a264d1dfc38404/Samples

The upstream README is retained as SOURCE-README.txt. The web-ready collection does not include every velocity layer, release, or resonance sample from the full library.

Changes: converted to 44.1 kHz stereo MP3, retained at most 8 seconds, applied a 0.2-second end fade when the sample reaches that duration. Piano Path uses the closest recorded note and changes playback rate for intervening notes, plus a gain fade when a key is released. MIDI velocity chooses the layer and gain. Samples are hosted with the website; no third-party audio CDN is needed at runtime.
