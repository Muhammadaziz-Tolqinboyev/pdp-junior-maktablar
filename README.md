# PDP Junior — Maktablar uchun taqdimot

Maktabga borib, o'quvchilarni IT yo'nalishiga qiziqtirish uchun interaktiv
taqdimot. Zalda yoki sinfda proyektorda ochiladi.

**Sukut bo'yicha 10 daqiqalik yo'l yoqilgan: 11 ta slayd.**
Vaqt ko'proq bo'lsa — `M` tugmasi bilan to'liq versiyaga (17 slayd) o'tiladi.

## Asosiy g'oya: bola tomoshabin emas, ishtirokchi

Taqdimot boshida o'quvchi **ismini yozadi** — shundan keyin sayt ham, bot ham,
yakuniy natija ham unga ism bilan murojaat qiladi. Yo'l davomida u o'zi bosadi,
yozadi, o'ynaydi; oxirida **"bugungi natijang"** slaydi hammasini yig'ib
ko'rsatadi. To'g'ri javoblarda ovozli signal va konfetti chiqadi.

## Vaqtni boshqarish

Yuqorida **soat** turadi: `0:00 / 0:40` — chapda o'tgan vaqt, o'ngda shu
slaydgacha bo'lishi kerak bo'lgan vaqt. Kechiksangiz sariq, 10 daqiqadan
oshsangiz qizil bo'ladi.

- Soat birinchi slayddan keyingisiga o'tganda o'zi boshlanadi
- Soatni bosish — to'xtatadi / davom ettiradi
- Ikki marta bosish — noldan boshlaydi

Ustoz izohlarida (`T`) har slaydning vaqt chegarasi yozilgan.

## Boshqaruv

| Tugma | Vazifa |
|-------|--------|
| `←` `→` / `Space` | Slaydlar (qo'shimchalari o'tkazib yuboriladi) |
| `M` | 10 daqiqalik yo'l ⇄ to'liq versiya |
| `T` | Ustoz izohlari |
| `O` | Barcha slaydlar ro'yxati |
| `F` | To'liq ekran |
| `S` | Ovozni yoqish / o'chirish |
| `Home` / `End` | Birinchi / oxirgi slayd |

Havola oxiriga `#7` qo'shilsa, to'g'ridan-to'g'ri 7-slayd ochiladi.

## 10 daqiqalik yo'l (11 slayd)

| Vaqt | Slayd | O'quvchi nima qiladi |
|------|-------|----------------------|
| 0:40 | Bugun sen… | **Ismini yozadi** |
| 1:00 | Qaysi biri kod bilan yozilgan? | 6 ta kartani ochadi |
| 1:30 | Klaviaturani bos — kodni sen yozasan | **Tugma bosadi, kod yoziladi, sayt quriladi** |
| 1:15 | Bu o'yin — 80 qator kod | O'ynaydi, ochko yig'adi |
| 1:00 | Bot — odam emas, kod | Bot uni ismi bilan qarshi oladi |
| 1:00 | Qaysi biri tuzoq? | **Soxta SMS'ni topadi** |
| 0:40 | 18 oyda nima yasaysan? | 6 ta natija |
| 0:40 | 18 oy — 4 bosqich | Yo'l xaritasi |
| 1:15 | Qaysi yo'nalish senga mos? | **3 savollik mini-test** |
| 0:30 | Bugun nima qilding? | Shaxsiy natija kartasi |
| 0:30 | Keyingi qadam | Yozilish qadamlari va kontakt |

Jami: **10:00**

## Qo'shimcha slaydlar (to'liq versiyada, `M`)

Jonli sahifa demosi (ism, rang, belgi) · AI'dan yaxshi javob olish ·
Parol kuchi o'lchagichi · Demo Day · Kim qatnasha oladi · IT viktorina.

Bularni alohida ham ochish mumkin: `O` bilan ro'yxatdan tanlang.

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
assets/css/fx.css         ism, klaviatura mashqi, kasb testi, soat
assets/js/deck.js         slayd dvigateli, 10 daqiqalik yo'l va soat
assets/js/fx.js           ovoz, konfetti va o'quvchi natijasi (PDP.kid)
assets/js/scenes-*.js     sahnalar, o'yin, viktorina va testlar
```

Slaydning vaqt chegarasi `data-sec` atributida, qo'shimcha slaydlar esa
`data-opt` bilan belgilangan — tartibni o'zgartirish uchun shularni tahrirlang.

Build kerak emas, tashqi kutubxona yo'q (faqat Google Fonts).
GitHub'ga push qilinganda Netlify o'zi yangilaydi.

## Lokal ishga tushirish

```bash
python -m http.server 8000
```

So'ng brauzerda `http://localhost:8000` ni oching.
