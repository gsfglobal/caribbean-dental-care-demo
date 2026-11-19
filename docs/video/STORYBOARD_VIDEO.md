# Video demo — Caribbean Dental Care (stato: MP4 completato)

File: `Caribbean_Dental_Care_Demo_Video.mp4` — 1:05, 1920×1080, 24 fps, H.264, audio AAC −16 LUFS.
Registrazioni reali del sito funzionante (build statica), catturate fotogramma per fotogramma con orologio controllato (Playwright) → movimento fluido anche del 3D. Nessun mockup di funzioni inesistenti. Dati della dashboard fittizi ed etichettati.

| # | Tempo | Scena | Didascalia (NL) |
|---|---|---|---|
| 1 | 0:00–0:04 | Apertura con logo (sostituto temporaneo) | Uw nieuwe website |
| 2 | 0:04–0:12 | Hero con dente 3D che segue il mouse | Een warme eerste indruk, met een interactieve 3D-kies |
| 3 | 0:12–0:26 | Scorrimento homepage: fiducia, trattamenti, estetica, studio | Alles wat een patiënt wil weten, op één pagina |
| 4 | 0:26–0:34 | Hover 3D sulle card → pagina "Kronen" | Elke behandeling helder uitgelegd |
| 5 | 0:34–0:44 | Versione mobile in cornice smartphone, barra Bel ons/WhatsApp | Gemaakt voor de telefoon |
| 6 | 0:44–0:50 | Compilazione e invio del modulo, conferma onesta | Een afspraak aanvragen in één minuut |
| 7 | 0:50–1:00 | Dashboard: login demo → Aanvragen → stato "Contact opgenomen" + nota | De aanvraag staat direct in de beheeromgeving van uw team |
| 8 | 1:00–1:05 | Chiusura: logo, indirizzo, telefono/WhatsApp | Persoonlijke zorg, ook online. |

Musica: composta da zero in codice (music.wav), nessun brano di terzi.

## Voce narrante (opzionale, non registrata)
Testo pronto in olandese se si vuole aggiungere una voce (es. ElevenLabs), ~60 s:
> Caribbean Dental Care: persoonlijke tandheelkundige zorg in Kralendijk. Dit is uw nieuwe website. Een warme eerste indruk, met een interactieve 3D-kies in de kleuren van uw logo. Alles wat een patiënt wil weten staat op één pagina: uw behandelingen, uw praktijk aan de Kaya Korona, en hoe hij snel contact opneemt. Elke behandeling wordt helder en eerlijk uitgelegd. Op de telefoon kan een patiënt met één tik bellen of WhatsAppen. Een afspraak aanvragen duurt een minuut — en de aanvraag staat meteen in de beheeromgeving van uw team, waar u hem opvolgt tot hij is afgerond. Caribbean Dental Care. Persoonlijke zorg, ook online.

Da rigenerare quando arriva il logo originale: `python3 capture.py all && bash assemble.sh`.
