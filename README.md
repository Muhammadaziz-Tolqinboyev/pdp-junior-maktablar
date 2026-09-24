# PDP Junior — Maktablar uchun taqdimot

Maktabga borib, o'quvchilarni IT yo'nalishiga qiziqtirish uchun mo'ljallangan
**15 slaydlik taqdimot**. Zalda yoki sinfda proyektorda ochiladi.

Maqsad: o'quvchi taqdimot oxirida **bepul probniy darsga yozilsin**.

## Qanday ishlatiladi

1. Havolani noutbukda ochib, `F` tugmasi bilan to'liq ekranga o'ting.
2. `T` tugmasi — ustoz uchun izohlar (nima deyish kerakligi). O'quvchilarga ko'rinmaydi.
3. Slaydlar orasida `→` `←` yoki `Space` bilan yuriladi.
4. Interaktiv slaydlarda o'quvchini chaqirib, **o'zi bosib ko'rsin** — eng kuchli ta'sir shunda.

| Tugma | Vazifa |
|-------|--------|
| `←` `→` / `Space` | Slaydlar |
| `T` | Ustoz izohlari |
| `O` | Barcha slaydlar ro'yxati |
| `F` | To'liq ekran |
| `Home` / `End` | Birinchi / oxirgi slayd |

Havola oxiriga `#7` qo'shilsa, to'g'ridan-to'g'ri 7-slayd ochiladi.

## Slaydlar

| № | Slayd | Nimasi bor |
|---|-------|-----------|
| 01 | Telefoningdagi hamma narsani kimdir yozgan | Animatsiyali muqova |
| 02 | Qaysi biri kod bilan yozilgan? | 6 ta aylanadigan karta |
| 03 | 3 daqiqada birinchi sahifang | Jonli demo: ism, rang, belgi |
| 04 | Sayt shunday quriladi | Video: kod yoziladi, sayt quriladi |
| 05 | Bu o'yin — 80 qator kod | O'ynasa bo'ladigan o'yin |
| 06 | Bot — odam emas, kod | Video: bot suhbati + Python kodi |
| 07 | AI'dan yaxshi javob olish | Prompt quruvchi |
| 08 | Parolingni necha soniyada topadi? | Parol o'lchagich |
| 09 | Qaysi biri tuzoq? | Soxta SMS'ni topish |
| 10 | 18 oyda nima yasaysan? | 6 ta natija |
| 11 | 18 oy — 4 bosqich | Yo'l xaritasi |
| 12 | 3 marta sahnada | Demo Day |
| 13 | Kim qatnasha oladi? | Yosh, jadval, talablar |
| 14 | Viktorina | 4 savolli o'yin, zal bilan |
| 15 | Birinchi dars — bepul | Yozilish qadamlari va kontakt |

## To'ldirish kerak bo'lgan joy

Oxirgi slaydda (`index.html` ichida `SHU YERNI TO'LDIRING` izohi bor) telefon
raqami, Telegram manzili va sayt havolasi **namuna** holda turibdi. QR kod uchun
ham bo'sh joy qoldirilgan. Ularni o'z ma'lumotlaringizga almashtiring.

## Tuzilishi

```
index.html              slaydlar (mazmun shu yerda)
assets/css/deck.css     asosiy dizayn
assets/css/scenes.css   animatsiya va interaktiv qismlar
assets/css/school.css   viktorina, yozilish va kontakt bloklari
assets/js/deck.js       slayd dvigateli
assets/js/scenes-*.js   video sahnalar, o'yin va viktorina
```

Build kerak emas, tashqi kutubxona yo'q (faqat Google Fonts).
GitHub'ga push qilinganda Netlify o'zi yangilaydi.

## Lokal ishga tushirish

```bash
python -m http.server 8000
```

So'ng brauzerda `http://localhost:8000` ni oching.
