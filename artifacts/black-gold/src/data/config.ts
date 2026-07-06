/**
 * CENTRALIZED SITE CONFIGURATION
 * Edit this file to update all content, prices, links, and account numbers.
 */

export const siteConfig = {
  brand: {
    nameAr: "الذهب الأسود",
    nameEn: "Black Gold",
    taglineAr: "فحم شيشة فاخر — جودة لا تضاهى",
    taglineEn: "Premium Hookah Charcoal — Unrivaled Quality",
    descriptionAr: "فحم شيشة فاخر بجودة لا مثيل لها. اشتعال سريع، احتراق طويل، وبدون روائح.",
    descriptionEn: "Premium hookah charcoal of unrivaled quality. Quick ignition, long burn, odorless.",
    email: "blackgold.ye@gmail.com",
    whatsappNumber: "967700000000",    // B2C WhatsApp (← update for production)
    whatsappDisplay: "+967 700 000 000",
  },

  b2b: {
    whatsappNumber: "967700000001",    // B2B WhatsApp (← update for production)
    codDisableThreshold: 100000,       // Disable Cash on Delivery above 100,000 YER
    wholesaleMoq: 12,                  // Minimum order quantity for wholesale products
  },

  social: {
    instagram: "https://instagram.com/blackgold",
    facebook: "https://facebook.com/blackgold",
  },

  seo: {
    title: "الذهب الأسود — فحم شيشة فاخر | Black Gold Premium Charcoal",
    descriptionAr: "فحم شيشة فاخر بجودة لا مثيل لها. اشتعال سريع، احتراق طويل، وبدون روائح. توصيل سريع.",
    descriptionEn: "Premium hookah charcoal. Quick ignition, long-lasting burn, odorless. Fast delivery.",
    ogImage: "/brand/logo-transparent.png",
    keywords: "فحم شيشة, فحم بلدي, فحم فاخر, Black Gold, hookah charcoal, شيشة",
  },

  delivery: {
    freeThreshold: 100000,   // Free shipping above 100,000 YER
    fee: 500,                // Default fee when city not in citiesShipping list
    currencyAr: "ر.ي",
    currencyEn: "YER",
  },

  citiesShipping: [
    { id: "sanaa",     ar: "صنعاء",    en: "Sana'a",    fee: 500  },
    { id: "aden",      ar: "عدن",      en: "Aden",      fee: 1000 },
    { id: "taiz",      ar: "تعز",      en: "Taiz",      fee: 800  },
    { id: "hodeidah",  ar: "الحديدة",  en: "Hodeidah",  fee: 800  },
    { id: "ibb",       ar: "إب",       en: "Ibb",       fee: 700  },
    { id: "mukalla",   ar: "المكلا",   en: "Mukalla",   fee: 1500 },
    { id: "hadramout", ar: "حضرموت",   en: "Hadramout", fee: 1500 },
    { id: "marib",     ar: "مأرب",     en: "Marib",     fee: 1200 },
    { id: "dhamar",    ar: "ذمار",     en: "Dhamar",    fee: 600  },
    { id: "amran",     ar: "عمران",    en: "Amran",     fee: 600  },
    { id: "hajjah",    ar: "حجة",      en: "Hajjah",    fee: 900  },
    { id: "saadah",    ar: "صعدة",     en: "Saadah",    fee: 1000 },
    { id: "mahwit",    ar: "المحويت",  en: "Mahwit",    fee: 700  },
    { id: "bayda",     ar: "البيضاء",  en: "Al-Bayda",  fee: 900  },
  ],

  ewallets: [
    { id: "flousak",      nameAr: "فلوسك",       nameEn: "Flousak",      accountNumber: "XXXXXXXX", accountNameAr: "الذهب الأسود", accountNameEn: "Black Gold" },
    { id: "jeeb",         nameAr: "جيب",          nameEn: "Jeeb",         accountNumber: "XXXXXXXX", accountNameAr: "الذهب الأسود", accountNameEn: "Black Gold" },
    { id: "jawali",       nameAr: "جوالي",        nameEn: "Jawali",       accountNumber: "XXXXXXXX", accountNameAr: "الذهب الأسود", accountNameEn: "Black Gold" },
    { id: "mobile_money", nameAr: "موبايل موني",  nameEn: "Mobile Money", accountNumber: "XXXXXXXX", accountNameAr: "الذهب الأسود", accountNameEn: "Black Gold" },
  ],
} as const;

export type EwalletId = typeof siteConfig.ewallets[number]["id"];
export type CityId = typeof siteConfig.citiesShipping[number]["id"];

export interface SavedAddress {
  id: string;
  label: string;
  city: string;
  address: string;
}
