import { DiseaseInfo } from '../types/dermatology';

export const HAND_DISEASES: DiseaseInfo[] = [
  {
    id: 'dyshidrotic-eczema',
    name: 'Disgidrotik ekzema (Pomfoliks)',
    latinName: 'Dyshidrotic Eczema / Pompholyx',
    category: 'ekzema',
    shortDesc: "Barmoqlar yoni, kaftlar va oyoq tagida chuqur joylashgan, juda kuchli qichuvchi mayda shaffof pufakchalar bilan kechuvchi o'ziga xos ekzema shakli.",
    symptoms: [
      "Barmoqlarning yon yuzasida 'tariq donasi' yoki 'sago donasi'ga o'xshash qichuvchi pufakchalar",
      "Pufakchalar yorilgach qizarish, qipiqlanish va chuqur og'riqli yoriqlar paydo bo'lishi",
      "Issiq havoda yoki kuchli stressda toshmalarning kuchayishi",
      "Kechasi bezovta qiluvchi zo'riqqan qichishish va achishish"
    ],
    causes: [
      "Stress va ruhiy zo'riqish",
      "Qo'lning haddan ortiq terlashi (gipergidroz) yoki nam muhitda uzoq qolishi",
      "Nikol, xrom kabi metallarga yoki yuvish vositalariga sezuvchanlik",
      "Atopik moyillik (irsiy allergiya)"
    ],
    prevention: [
      "Qo'llarni issiq suvda uzoq ushlamaslik",
      "Uy tozalash ishlarida ichi paxtali himoya qo'lqoplaridan foydalanish",
      "Qo'l yuvgandan so'ng darhol emolyent kremlar surtish",
      "Stress darajasini nazorat qilish va me'yordan ortiq terlashni davolash"
    ],
    careTips: [
      "Pufakchalarni aslo tirnamang va igna bilan yormang (infeksiya tushishi mumkin)",
      "Kuchsiz sovutilgan fiziologik eritma yoki romashka damlamasi bilan 10-15 daqiqa kompress qiling",
      "Tseramid va rux (sink) saqlovchi tinchlantiruvchi kremlar qo'llang",
      "Shifokor tavsiyasi bilan qisqa muddatli mahalliy kortikosteroid malhamlar qo'llaniladi"
    ],
    urgency: 'moderate',
    iconType: 'droplets'
  },
  {
    id: 'contact-dermatitis',
    name: "Kontakt allergik va toksik dermatit",
    latinName: 'Contact Dermatitis',
    category: 'allergik',
    shortDesc: "Qo'l terisiga tashqi kimyoviy moddalar, agressiv yuvish vositalari, bo'yoqlar, kislota yoki metallar tegishi oqibatida rivojlanadigan yallig'lanish.",
    symptoms: [
      "Bezatilgan modda teggan sohada chegaralangan kuchli qizarish",
      "Terining quruqlashishi, taranglashishi va mayda yoriqlar",
      "Qichishish, qizish va sanchuvchi og'riq",
      "Og'ir holatlarda shish va mayda toshmalar"
    ],
    causes: [
      "Idish yuvish gellari, kukunlar, oqartiruvchilar (xlor, kislota)",
      "Spirtli qo'l antiseptiklaridan haddan ortiq foydalanish",
      "Lateks qo'lqoplar yoki metall buyumlar (nikel, soat tasmasi)",
      "Qurilish materiallari (sement, bo'yoq, erituvchilar)"
    ],
    prevention: [
      "Qo'zg'atuvchi kimyoviy modda bilan to'g'ridan-to'g'ri aloqani darhol to'xtatish",
      "Nitrilli (lateksmas) himoya qo'lqoplaridan foydalanish",
      "Sovun o'rniga agressiv bo'lmagan sindet-kremlardan foydalanish",
      "Qo'l terisi to'sig'ini tiklovchi 'Barrier' (to'siq) kremlarini oldindan surtish"
    ],
    careTips: [
      "Zararlangan sohani darhol oqib turgan toza iliq suvda 10 daqiqa yuving",
      "D-Pantenol yoki Tseramidli qalin regeneratsiya kremini kuniga 3-4 mahal surting",
      "Spirtli yoki parfyumeriyalangan vositalarni mutlaqo ishlatmang"
    ],
    urgency: 'mild',
    iconType: 'shield-alert'
  },
  {
    id: 'hand-eczema',
    name: "Atopik va surunkali qo'l ekzemasi",
    latinName: 'Chronic Hand Eczema',
    category: 'ekzema',
    shortDesc: "Qo'l terisining tabiiy himoya to'sig'i buzilishi natijasida uzoq davom etuvchi quruqlik, qipiqlanish, yoriqlar va yallig'lanish bilan kechuvchi kasallik.",
    symptoms: [
      "Qo'l terisining qo'pol, quruq va qalinlashgan ko'rinishi (lixenifikatsiya)",
      "Barmoq bo'g'imlarida chuqur, qonaydigan og'riqli yoriqlar",
      "Davriy to'lqinsimon qichishish xurujlari",
      "Sovuq havoda va suv tekkanida kuchayadigan og'riq"
    ],
    causes: [
      "Genetik atopik moyillik (oilada allergiya, astma yoki dermatit bo'lishi)",
      "Epidermal to'siq oqsilining (filaggrin) tug'ma yetishmovchiligi",
      "Atrof-muhitning quruq va sovuq havosi",
      "Doimiy suv va yuvish vositalari bilan ishlash (oshpazlar, tozalovchilar, sartaroshlar)"
    ],
    prevention: [
      "'3 daqiqa qoidasi': Qo'l yuvgach, sochiq bilan artilishi bilanoq 3 daqiqa ichida krem surtish",
      "Qishda ko'chaga chiqishdan 20 daqiqa oldin yog'li himoya kremi surtish va issiq qo'lqop kiyish",
      "Xona namligini 45-60% darajasida saqlash"
    ],
    careTips: [
      "Urea (mochevina 5-10%) va shi moyi saqlovchi intensiv namlantiruvchi balzamlardan foydalaning",
      "Tunda qalin krem surtib, ustidan toza paxta qo'lqop kiyib uxlash (okkluzion usul)",
      "Qonayotgan yoriqlarga mikroblarga qarshi regenerativ malhamlar qo'llash"
    ],
    urgency: 'moderate',
    iconType: 'layers'
  },
  {
    id: 'tinea-manuum',
    name: "Qo'l zamburug'i (Tinea Manuum / Mikoz)",
    latinName: 'Tinea Manuum',
    category: 'infeksion',
    shortDesc: "Dermatofit zamburug'lari keltirib chiqaradigan infeksiya. Ko'pincha 'Ikki oyoq - bir qo'l' sindromi ko'rinishida bitta qo'lda rivojlanadi.",
    symptoms: [
      "Odatda faqat BIR qo'l kaftida yoki barmoqlarida toshma bo'lishi (asimmterik)",
      "Halqasimon, qirralari ko'tarilgan va markazi tuzalayotgan qizil dog'lar",
      "Kaft chiziqlari bo'ylab unsimon oq qipiqlanish",
      "Oyoq panjasida yoki tirnoqda ham zamburug' belgilarining mavjudligi"
    ],
    causes: [
      "Trichophyton rubrum yoki boshqa dermatofit zamburug'lari",
      "Oyoqdagi zamburug'ni qo'l bilan qashlash orqali yuqtirish",
      "Zararlangan hayvonlar (mushuk, it) bilan kontakt",
      "Umumiy sochiq, sport anjomlari orqali yuqish"
    ],
    prevention: [
      "Oyoqdagi zamburug'ni o'z vaqtida to'liq davolash",
      "Begona kishilarning qo'lqoplari yoki sochiqlaridan foydalanmaslik",
      "Hayvonlarni silagandan so'ng qo'lni sovunlab yuvish"
    ],
    careTips: [
      "DIQQAT: Zamburug'ga gormonal (kortikosteroid) kremlar surtish qat'iyan man etiladi (bu kasallikni yashirib, kuchaytiradi)",
      "Dermatolog ko'rigidan o'tib, zamburug' so'lagi (soskob) tahlilini topshirish zarur",
      "Shifokor tavsiya qilgan zamburug'ga qarshi mahalliy kremlarni (Terbinafin, Klotrimazol) toshma yo'qolgandan keyin ham yana 2 hafta davom ettirish"
    ],
    urgency: 'moderate',
    iconType: 'bug'
  },
  {
    id: 'paronychia',
    name: "Paronixiya (Tirnoq atrofi yallig'lanishi)",
    latinName: 'Paronychia',
    category: 'infeksion',
    shortDesc: "Tirnoq atrofidagi yumshoq to'qimalarning (kutikula va tirnoq valigi) bakterial yoki zamburug'li o'tkir yallig'lanishi.",
    symptoms: [
      "Tirnoq yonidagi terining kuchli qizarishi, shishishi va 'puls uruvchi' og'riq",
      "Tirnoq valigi ostida oqimtir-sariq yiring to'planishi",
      "Tirnoqqa tegishi bilanoq keskin og'riq sezilishi",
      "Surunkali shaklida tirnoq plastinkasining deformatsiyalanishi va to'lqinsimon bo'lib qolishi"
    ],
    causes: [
      "Kutikulani noto'g'ri kesish, manikyur jarohatlari yoki barmoqni tishlash (zavsenitsani yulish)",
      "Tirnoq ostiga tikan, metall qirindisi kirishi",
      "Staphylococcus aureus yoki Candida zamburug'lari tushishi",
      "Qo'lning suvda uzoq vaqt ivishi"
    ],
    prevention: [
      "Kutikulani chuqur va jarohatlab kesmaslik, steril manikyur asboblaridan foydalanish",
      "Tirnoq chetidagi osilib qolgan terichalarni (zavsenitsa) yulmaslik, balki qaychi bilan ehtiyotkorona kesish",
      "Qo'lni uzoq ivitishdan saqlash"
    ],
    careTips: [
      "Dastlabki bosqichda kuniga 3-4 mahal 15 daqiqadan iliq tuzli yoki xlorgeksidinli vanna qiling",
      "Agar yiring aniq to'plangan bo'lsa va pulsatsiyalanuvchi og'riq bo'lsa - DARHOL xirurg yoki dermatologga boring (mustaqil teshmang!)",
      "Antibakterial malhamlar (masalan, Levomekol) bilan steril bog'lam qo'ying"
    ],
    urgency: 'high',
    iconType: 'alert-triangle'
  },
  {
    id: 'hand-psoriasis',
    name: "Qo'l va kaft psoriazi",
    latinName: 'Palmar Psoriasis',
    category: 'autoimmun',
    shortDesc: "Surunkali noinfeksion autoimmun kasallik. Kaftlar va barmoqlarda qalinlashgan, kumush-oq qipiqli qizil dog'lar bilan namoyon bo'ladi.",
    symptoms: [
      "Aniq chegaralangan qizg'ish-pushti qalinlashgan blyashkalar",
      "Ustida qalin kumushrang-oq po'stloqlar (qipiqlar)",
      "Qipiqlarni olganda nuqtali qon tomchilari paydo bo'lishi (Auspitz belgisi)",
      "Tirnoqlarda 'angishvona' simptomi (mayda chuqurchalar) yoki sarg'ish yog' dog'i"
    ],
    causes: [
      "Immun tizimining disbalansi va teri hujayralarining haddan tashqari tez yangilanishi",
      "Genetik moyillik",
      "Doimiy mexanik ishqalanish, bosim yoki mikrojarohatlar (Kobner fenomeni)",
      "Stress va surunkali infeksiyalar"
    ],
    prevention: [
      "Kaft terisini mexanik jarohatlar va og'ir ishqalanishdan asrash",
      "Qo'pol asboblardan foydalanganda yumshoq himoya qo'lqoplari kiyish",
      "Yumshatuvchi keratolotik kremlarni muntazam ishlatish"
    ],
    careTips: [
      "Salitsil kislotasi (2-5%) yoki yuqori konsentratsiyali karbamid (Urea 20-30%) saqlovchi kremlar qalin qipiqlarni muloyim ko'chirishga yordam beradi",
      "D vitamini analoglari va kalsipotriol kremlari (shifokor ko'rsatmasi bilan)",
      "Fototerapiya (tor spektrli UV-B nurlar) juda yaxshi samara beradi"
    ],
    urgency: 'moderate',
    iconType: 'sun'
  },
  {
    id: 'scabies',
    name: "Qo'tir (Scabies / Chesetka)",
    latinName: 'Scabies',
    category: 'infeksion',
    shortDesc: "Qo'tir kanasi (Sarcoptes scabiei) keltirib chiqaradigan o'ta yuqumli parazitar kasallik. Barmoqlar orasida kuchli qichishish xarakterli.",
    symptoms: [
      "Aynan tunda ko'rpa ostida qiziganda chidab bo'lmas darajada kuchayuvchi qichishish",
      "Barmoqlar orasi va bilak bukilmalarida 2-5 mm uzunlikdagi ingichka kulrang-oqimtir chiziqlar (kana yo'llari)",
      "Chiziqlar uchida mayda nuqtali toshmalar yoki pufakchalar",
      "Oilaning boshqa a'zolarida ham xuddi shunday qichishish paydo bo'lishi"
    ],
    causes: [
      "Mikroskopik qo'tir kanasi",
      "Bemor kishi bilan yaqin tana kontakti yoki qo'l berib ko'rishish",
      "Zararlangan ko'rpa-to'shak, sochiq yoki kiyimlardan birgalikda foydalanish"
    ],
    prevention: [
      "Bemor bilan tana kontaktini to'xtatish",
      "Barcha kiyim-kechak, sochiq va ko'rpa-to'shaklarni 60°C dan yuqori haroratda yuvish va issiq dazmol bilan dazmollash",
      "Yuvish imkoni bo'lmagan buyumlarni yopiq polietilen qopda kamida 5 kun saqlash (kana odamsiz 3-4 kunda o'ladi)"
    ],
    careTips: [
      "DIQQAT: Oilaning BARCHA a'zolari bir vaqtda davolanishi SHART (hatto belgilar bo'lmasa ham)",
      "Permetrin 5% kremi yoki Benzilbenzoat 20% emulsiyasi butun tanaga (bo'yindan pastga) surtilib, 8-12 soatdan so'ng yuvib tashlanadi",
      "7 kundan keyin kurs qaytariladi"
    ],
    urgency: 'high',
    iconType: 'shield-x'
  },
  {
    id: 'xerosis',
    name: "Kseroz (Qo'l terisining o'ta qurishi)",
    latinName: 'Hand Xerosis / Severe Dry Skin',
    category: 'mavsumiy',
    shortDesc: "Tashqi omillar ta'sirida teridagi lipid va namlik muvozanati buzilib, qo'lning haddan ziyod quruq, tarang va yoriq holatga kelishi.",
    symptoms: [
      "Terining quruqlashishi, qo'l yuvgandan so'ng darhol 'tortishib qolishi'",
      "Mayda oq po'st tashlash, qo'l yuzasining g'adir-budurligi",
      "Barmoq uchlarida va bo'g'imlarda mayda og'riqli yoriqlar",
      "Yengil qichishish va sezuvchanlik"
    ],
    causes: [
      "Qish faslidagi quruq va ayozli ob-havo",
      "Xonadagi isitish tizimlari tufayli havoning haddan tashqari quruqligi",
      "Qo'lni juda issiq suvda tez-tez yuvish",
      "Yetarlicha suv ichmaslik va A, E vitaminlari tanqisligi"
    ],
    prevention: [
      "Iliq (hech qachon qaynoq bo'lmagan) suvda yuvish",
      "Qo'l sovunini krem-sovun yoki moyli tozalovchi gellarga almashtirish",
      "Har bir qo'l yuvishdan keyin darhol namlantiruvchi vosita qo'llash"
    ],
    careTips: [
      "Gialuron kislotasi, glitserin, pantenol va skvalan saqlovchi kremlardan foydalaning",
      "Uyda havo namlagich (humidifier) ishlatish",
      "Kecha uyquga yotishdan oldin qo'llarga tabiiy shi moyi yoki qalin krem surting"
    ],
    urgency: 'mild',
    iconType: 'wind'
  }
];
