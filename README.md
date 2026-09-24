# PDP Junior — Maktablar uchun taqdimot

Maktabga borib, o'quvchilarni IT yo'nalishiga qiziqtirish uchun **17 slaydlik
interaktiv taqdimot**. Zalda yoki sinfda proyektorda ochiladi.

Maqsad: o'quvchi taqdimot oxirida **bepul probniy darsga yozilsin**.

## Asosiy g'oya: bola tomoshabin emas, ishtirokchi

Taqdimot boshida o'quvchi **ismini yozadi** — shundan keyin sayt ham, bot ham,
yakuniy natija ham unga ism bilan murojaat qiladi. Yo'l davomida u o'zi bosadi,
yozadi, o'ynaydi; oxirida esa **"bugungi natijang"** slaydi hamma natijani
yig'ib ko'rsatadi.

To'g'ri javob va g'alabalarda **ovozli signal va konfetti** chiqadi
(ovozni `S` tugmasi yoki yuqoridagi karnay tugmasi bilan o'chirish mumkin).

## Qanday ishlatiladi

1. Havolani noutbukda ochib, `F` bilan to'liq ekranga o'ting.
2. `T` — ustoz izohlari (nima deyish kerakligi). O'quvchilarga ko'rinmaydi.
3. Interaktiv slaydlarda o'quvchini chaqirib, **o'zi bosib ko'rsin**.

| Tugma | Vazifa |
|-------|--------|
| `←` `→` / `Space` | Slaydlar |
| `T` | Ustoz izohlari |
| `O` | Barcha slaydlar ro'yxati |
| `F` | To'liq ekran |
| `S` | Ovozni yoqish / o'chirish |
| `Home` / `End` | Birinchi / oxirgi slayd |

Havola oxiriga `#7` qo'shilsa, to'g'ridan-to'g'ri 7-slayd ochiladi.

## Slaydlar

| № | Slayd | O'quvchi nima qiladi |
|---|-------|----------------------|
| 01 | Bugun sen... (yozuv effekti) | **Ismini yozadi** |
| 02 | Qaysi biri kod bilan yozilgan? | 6 ta kartani ochadi (hammasi ochilsa — konfetti) |
| 03 | 3 daqiqada birinchi sahifang | Ism, rang, belgi va o'lchamni o'zgartiradi |
| 04 | Klaviaturani bos — kodni sen yozasan | **Tugma bosadi, kod o'zi yoziladi va sayt quriladi** |
| 05 | Bu o'yin — 80 qator kod | O'ynaydi, ochko yig'adi |
| 06 | Bot — odam emas, kod | Bot uni ismi bilan qarshi oladi |
| 07 | AI'dan yaxshi javob olish | So'rovga qism qo'shadi, javob yaxshilanadi |
| 08 | Parolingni necha soniyada topadi? | Tayyor parollarni bosadi yoki o'zi yozadi |
| 09 | Qaysi biri tuzoq? | **Soxta SMS'ni topadi** (topsa — konfetti) |
| 10 | 18 oyda nima yasaysan? | 6 ta natija |
| 11 | 18 oy — 4 bosqich | Yo'l xaritasi |
| 12 | 3 marta sahnada | Demo Day |
| 13 | Kim qatnasha oladi? | Yosh, jadval, talablar |
| 14 | Viktorina | 4 savol, ball hisoblanadi |
| 15 | Qaysi yo'nalish senga mos? | **3 savollik mini-test** → Frontend / Python / AI / Xavfsizlik |
| 16 | Bugun nima qilding? | O'yin, viktorina, fishing va yo'nalish — bitta kartada |
| 17 | Birinchi dars — bepul | Yozilish qadamlari va kontakt |

## To'ldirish kerak bo'lgan joy

Oxirgi slaydda kontaktlar hozir **namuna**: telefon, Telegram va sayt havolasi.
`index.html` ichida `SHU YERNI TO'LDIRING` izohi bilan belgilangan. QR kod uchun
ham bo'sh joy qoldirilgan.

## Tuzilishi

```
index.html                slaydlar (mazmun shu yerda)
assets/css/deck.css       asosiy dizayn
assets/css/scenes.css     video sahnalar va interaktiv qismlar
assets/css/school.css     viktorina, yozilish va kontakt bloklari
assets/css/fx.css         ism, klaviatura mashqi, kasb testi, natija
assets/js/deck.js         slayd dvigateli
assets/js/fx.js           ovoz, konfetti va o'quvchi natijasi (PDP.kid)
assets/js/scenes-*.js     sahnalar, o'yin, viktorina va testlar
```

Build kerak emas, tashqi kutubxona yo'q (faqat Google Fonts).
GitHub'ga push qilinganda Netlify o'zi yangilaydi.

## Lokal ishga tushirish

```bash
python -m http.server 8000
```

So'ng brauzerda `http://localhost:8000` ni oching.
