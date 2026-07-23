import type { BilingualText, ServiceCategoryValue } from "./types";

/**
 * Spec-mandated service catalogue. The backend seeds a smaller subset, so these
 * arrays act as the authoritative, always-available content for the Services
 * and Service Detail pages. When the backend returns richer data the hooks are
 * still used; these arrays guarantee the dispatch's required rituals always
 * render even before the actor is ready or if the seed is incomplete.
 */

export interface ServiceEntry {
  category: ServiceCategoryValue;
  name: BilingualText;
  description: BilingualText;
}

/** All rituals across the four categories, in display order. */
export const SERVICE_CATALOGUE: ServiceEntry[] = [
  // ---- Vedic Puja & Havan ----
  {
    category: "vedicPujaHavan",
    name: { hi: "रुद्राभिषेक", en: "Rudrabhishek" },
    description: {
      hi: "भगवान शिव का रुद्राभिषेक, अभिषेक एवं हवन सहित, संकट निवारण एवं सुख-समृद्धि हेतु।",
      en: "Abhishekam and fire ritual honoring Lord Shiva to remove hardships and invite prosperity.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "महागणपति होम", en: "Maha Ganapati Homa" },
    description: {
      hi: "विघ्नहर्ता गणेश जी का महाहोम, प्रत्येक शुभ कार्य के आरंभ में विघ्न बाधा निवारण हेतु।",
      en: "Grand fire ritual for Lord Ganesha to clear obstacles at the start of any auspicious work.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "श्री सत्यनारायण महापूजा", en: "Sri Satyanarayan Mahapooja" },
    description: {
      hi: "भगवान विष्णु की सत्यनारायण रूप में कथा एवं महापूजा, घर की सुख-समृद्धि हेतु।",
      en: "Story and grand puja honoring Lord Vishnu as Satyanarayan for household prosperity.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "सुंदरकांड पाठ", en: "Sundarkand Path" },
    description: {
      hi: "श्री रामचरितमानस के सुंदरकांड का पाठ, हनुमान जी की कृपा एवं संकट मोचन हेतु।",
      en: "Recitation of the Sundarkand from Ramcharitmanas for Hanuman Ji's grace and crisis relief.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "दुर्गा सप्तशती पाठ", en: "Durga Saptashati Path" },
    description: {
      hi: "माँ दुर्गा के सप्तशती पाठ, शत्रु बाधा निवारण एवं शक्ति प्राप्ति हेतु।",
      en: "Recitation of Durga Saptashati to neutralize adversaries and invoke divine strength.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "लक्ष्मी पूजा", en: "Lakshmi Puja" },
    description: {
      hi: "धन-धान्य एवं समृद्धि हेतु माँ लक्ष्मी की पूजा एवं हवन।",
      en: "Worship and fire ritual for Goddess Lakshmi to invite wealth and abundance.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "गणपति स्थापना", en: "Ganapati Sthapana" },
    description: {
      hi: "विघ्नहर्ता गणेश जी की विधिवत स्थापना एवं पूजन, शुभ आरंभ हेतु।",
      en: "Ritual installation and worship of Lord Ganesha for an auspicious beginning.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "हवन एवं यज्ञ", en: "Havan & Yagya" },
    description: {
      hi: "विभिन्न अवसरों हेतु वैदिक मंत्रों से युक्त हवन एवं यज्ञ, शुद्धि एवं कल्याण हेतु।",
      en: "Vedic fire rituals for various occasions to purify the environment and bring well-being.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "नवचंडी यज्ञ", en: "Navachandi Yagya" },
    description: {
      hi: "नव दुर्गा स्वरूपा देवी का महायज्ञ, अत्यंत दुष्प्रभाव निवारण एवं सिद्धि हेतु।",
      en: "Grand fire ritual for the nine forms of Goddess Durga to remove severe afflictions.",
    },
  },
  {
    category: "vedicPujaHavan",
    name: { hi: "चंडी पाठ", en: "Chandi Path" },
    description: {
      hi: "दुर्गा सप्तशती का संपूर्ण चंडी पाठ, दैवीय कृपा एवं रक्षा हेतु।",
      en: "Complete Chandi recitation of Durga Saptashati for divine grace and protection.",
    },
  },

  // ---- Graha Dosh & Shanti ----
  {
    category: "grahaDoshShanti",
    name: { hi: "नवग्रह शांति", en: "Navagraha Shanti" },
    description: {
      hi: "नव ग्रहों के दोष शांति हेतु विधिवत पूजा एवं हवन।",
      en: "Ritual pacification of the nine planets to neutralize planetary afflictions.",
    },
  },
  {
    category: "grahaDoshShanti",
    name: { hi: "नक्षत्र शांति", en: "Nakshatra Shanti" },
    description: {
      hi: "जन्म नक्षत्र के दोष शांति हेतु विशेष अनुष्ठान।",
      en: "Special ritual to pacify afflictions related to the birth nakshatra.",
    },
  },
  {
    category: "grahaDoshShanti",
    name: { hi: "महामृत्युंजय जाप", en: "Mahamrityunjay Jaap" },
    description: {
      hi: "भगवान शिव का महामृत्युंजय मंत्र जाप, आयु वृद्धि एवं रोग निवारण हेतु।",
      en: "Chanting of the Mahamrityunjay mantra for Lord Shiva to extend life and cure illness.",
    },
  },
  {
    category: "grahaDoshShanti",
    name: { hi: "कालसर्प दोष शांति", en: "Kaal Sarp Dosh Shanti" },
    description: {
      hi: "काल सर्प योग के दोष निवारण हेतु विधिवत अनुष्ठान एवं हवन।",
      en: "Prescribed ritual and fire ceremony to remedy the Kaal Sarp yog affliction.",
    },
  },
  {
    category: "grahaDoshShanti",
    name: { hi: "पितृ दोष शांति", en: "Pitru Dosh Shanti" },
    description: {
      hi: "पितरों के दोष शांति हेतु तर्पण एवं श्राद्ध विधि।",
      en: "Tarpan and shraddh ritual to pacify ancestral (pitru) afflictions.",
    },
  },
  {
    category: "grahaDoshShanti",
    name: { hi: "ग्रह शांति पूजा", en: "Graha Shanti Puja" },
    description: {
      hi: "विशेष ग्रह के अशुभ प्रभाव शांति हेतु लक्षित पूजा।",
      en: "Targeted puja to calm the adverse effects of a specific planet.",
    },
  },
  {
    category: "grahaDoshShanti",
    name: { hi: "राहु-केतु शांति", en: "Rahu-Ketu Shanti" },
    description: {
      hi: "राहु एवं केतु के दोष शांति हेतु विधिवत पूजा एवं हवन।",
      en: "Ritual pacification of Rahu and Ketu to neutralize their adverse effects.",
    },
  },

  // ---- Jeevan Samskar ----
  {
    category: "jeevanSamskar",
    name: { hi: "वैदिक विवाह", en: "Vedic Vivah" },
    description: {
      hi: "वैदिक विधि से विवाह संस्कार, सात फेरे एवं हवन सहित।",
      en: "Vedic wedding ceremony including the seven vows and fire ritual.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "कुंडली मिलान", en: "Kundali Milan" },
    description: {
      hi: "विवाह पूर्व गुण मिलान एवं अष्टकूट संगतता विश्लेषण।",
      en: "Pre-wedding gun milan and Ashtakoot compatibility analysis.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "गृह प्रवेश", en: "Griha Pravesh" },
    description: {
      hi: "नये घर में प्रवेश से पूर्व वास्तु शांति एवं हवन।",
      en: "Vastu shanti and fire ritual before entering a new home.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "वास्तु शांति", en: "Vastu Shanti" },
    description: {
      hi: "भवन एवं स्थान के वास्तु दोष शांति हेतु विधिवत पूजा।",
      en: "Ritual to pacify Vastu defects of a building or premises.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "नामकरण संस्कार", en: "Namkaran Samskar" },
    description: {
      hi: "नवजात शिशु के नामकरण का वैदिक संस्कार।",
      en: "Vedic naming ceremony for a newborn child.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "अन्नप्राशन", en: "Annaprashan" },
    description: {
      hi: "शिशु के प्रथम अन्न सेवन का वैदिक संस्कार।",
      en: "Vedic first-rice ceremony for an infant.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "मुंडन संस्कार", en: "Mundan Samskar" },
    description: {
      hi: "बालक के मुंडन (चौड़कर्म) का वैदिक संस्कार।",
      en: "Vedic tonsure (head-shaving) ceremony for a child.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "उपनयन संस्कार", en: "Upanayan Samskar" },
    description: {
      hi: "यज्ञोपवीत (जनेऊ) धारण का वैदिक संस्कार।",
      en: "Vedic sacred-thread (janeu) ceremony.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "भूमि पूजन", en: "Bhoomi Pujan" },
    description: {
      hi: "निर्माण पूर्व भूमि का वैदिक पूजन, वास्तु संतुलन हेतु।",
      en: "Vedic ground-breaking worship before construction for Vastu balance.",
    },
  },
  {
    category: "jeevanSamskar",
    name: { hi: "कार्यालय उद्घाटन", en: "Office Inauguration" },
    description: {
      hi: "नये कार्यालय या व्यवसाय स्थल के उद्घाटन पूजन।",
      en: "Inauguration worship for a new office or business premises.",
    },
  },

  // ---- Jyotish Services ----
  {
    category: "jyotishServices",
    name: { hi: "जन्म कुंडली", en: "Janam Kundali" },
    description: {
      hi: "जन्म तिथि, समय एवं स्थान आधारित व्यक्तिगत जन्म कुंडली विश्लेषण।",
      en: "Personal birth-chart analysis based on date, time, and place of birth.",
    },
  },
  {
    category: "jyotishServices",
    name: { hi: "विवाह कुंडली मिलान", en: "Vivah Kundali Milan" },
    description: {
      hi: "विवाह हेतु दोनों जन्म कुंडलियों का अष्टकूट मिलान।",
      en: "Ashtakoot matching of both partners' birth charts for marriage.",
    },
  },
  {
    category: "jyotishServices",
    name: { hi: "करियर परामर्श", en: "Career Consultation" },
    description: {
      hi: "कुंडली आधारित करियर एवं व्यवसाय चयन परामर्श।",
      en: "Birth-chart-based guidance for career and profession selection.",
    },
  },
  {
    category: "jyotishServices",
    name: { hi: "व्यवसाय परामर्श", en: "Business Consultation" },
    description: {
      hi: "व्यवसाय वृद्धि एवं निवेश हेतु ज्योतिषीय परामर्श।",
      en: "Astrological guidance for business growth and investment decisions.",
    },
  },
  {
    category: "jyotishServices",
    name: { hi: "ग्रह दोष विश्लेषण", en: "Graha Dosh Analysis" },
    description: {
      hi: "कुंडली में उपस्थित ग्रह दोषों का विस्तृत विश्लेषण एवं उपाय।",
      en: "Detailed analysis of planetary afflictions in the chart and their remedies.",
    },
  },
  {
    category: "jyotishServices",
    name: { hi: "शुभ मुहूर्त", en: "Shubh Muhurat" },
    description: {
      hi: "विवाह, गृह प्रवेश, व्यवसाय आदि शुभ कार्यों हेतु उपयुक्त मुहूर्त चयन।",
      en: "Auspicious-timing selection for weddings, house-warming, business, and more.",
    },
  },
  {
    category: "jyotishServices",
    name: { hi: "रत्न परामर्श", en: "Ratna Consultation" },
    description: {
      hi: "जन्म कुंडली अनुसार शुभ रत्न धारण हेतु परामर्श।",
      en: "Guidance on wearing auspicious gemstones suited to the birth chart.",
    },
  },
];

/** Spec-mandated pricing packages with included items. */
export interface PackageEntry {
  name: BilingualText;
  priceMinRupees: number;
  priceMaxRupees: number | null;
  includedItems: BilingualText[];
  description: BilingualText;
}

export const PACKAGE_CATALOGUE: PackageEntry[] = [
  {
    name: { hi: "गृह प्रवेश पूजा", en: "Griha Pravesh Puja" },
    priceMinRupees: 11000,
    priceMaxRupees: 15000,
    includedItems: [
      { hi: "वास्तु शांति पूजा", en: "Vastu shanti puja" },
      { hi: "हवन सामग्री", en: "Havan samagri" },
      { hi: "गृह प्रवेश विधि", en: "House-entry ritual" },
      { hi: "पंडित जी की डक्षिणा", en: "Pandit dakshina" },
    ],
    description: {
      hi: "नये घर में प्रवेश से पूर्व संपूर्ण वास्तु शांति एवं गृह प्रवेश पूजा पैकेज।",
      en: "Complete Vastu shanti and house-entry puja package before moving into a new home.",
    },
  },
  {
    name: { hi: "महामृत्युंजय जाप", en: "Mahamrityunjay Jaap" },
    priceMinRupees: 5100,
    priceMaxRupees: null,
    includedItems: [
      { hi: "महामृत्युंजय मंत्र जाप", en: "Mahamrityunjay mantra chanting" },
      { hi: "हवन सामग्री", en: "Havan samagri" },
      { hi: "पंडित जी की डक्षिणा", en: "Pandit dakshina" },
    ],
    description: {
      hi: "आयु वृद्धि एवं रोग निवारण हेतु महामृत्युंजय जाप पैकेज।",
      en: "Mahamrityunjay jaap package for longevity and relief from illness.",
    },
  },
  {
    name: { hi: "रुद्राभिषेक", en: "Rudrabhishek" },
    priceMinRupees: 3100,
    priceMaxRupees: null,
    includedItems: [
      { hi: "शिव अभिषेक सामग्री", en: "Shiva abhishek materials" },
      { hi: "हवन सामग्री", en: "Havan samagri" },
      { hi: "पंडित जी की डक्षिणा", en: "Pandit dakshina" },
    ],
    description: {
      hi: "भगवान शिव का रुद्राभिषेक पैकेज, अभिषेक एवं हवन सहित।",
      en: "Rudrabhishek package for Lord Shiva including abhishekam and fire ritual.",
    },
  },
  {
    name: { hi: "सत्यनारायण महापूजा", en: "Satyanarayan Mahapooja" },
    priceMinRupees: 4100,
    priceMaxRupees: null,
    includedItems: [
      { hi: "कथा पुस्तिका", en: "Katha booklet" },
      { hi: "प्रसाद सामग्री", en: "Prasad samagri" },
      { hi: "हवन सामग्री", en: "Havan samagri" },
      { hi: "पंडित जी की डक्षिणा", en: "Pandit dakshina" },
    ],
    description: {
      hi: "सत्यनारायण भगवान की कथा एवं महापूजा का संपूर्ण पैकेज।",
      en: "Complete package for the Satyanarayan katha and grand puja.",
    },
  },
  {
    name: { hi: "वास्तु शांति", en: "Vastu Shanti" },
    priceMinRupees: 11000,
    priceMaxRupees: 21000,
    includedItems: [
      { hi: "वास्तु शांति पूजा", en: "Vastu shanti puja" },
      { hi: "नवग्रह शांति", en: "Navagraha shanti" },
      { hi: "हवन सामग्री", en: "Havan samagri" },
      { hi: "पंडित जी की डक्षिणा", en: "Pandit dakshina" },
    ],
    description: {
      hi: "भवन एवं स्थान के वास्तु दोष शांति हेतु संपूर्ण पैकेज।",
      en: "Complete package to pacify Vastu defects of a building or premises.",
    },
  },
];

/** Category-level descriptions shown on the services page cards. */
export const CATEGORY_DESCRIPTIONS: Record<
  ServiceCategoryValue,
  BilingualText
> = {
  vedicPujaHavan: {
    hi: "वैदिक मंत्रों से संपन्न पूजा, हवन एवं यज्ञ — शुद्धि, समृद्धि एवं दैवीय कृपा हेतु।",
    en: "Pujas, havans, and yagyas performed with Vedic mantras for purity, prosperity, and divine grace.",
  },
  grahaDoshShanti: {
    hi: "ग्रह दोषों की शांति हेतु विधिवत अनुष्ठान — जीवन की बाधाओं का निवारण।",
    en: "Rituals to pacify planetary afflictions and remove obstacles from life.",
  },
  jeevanSamskar: {
    hi: "जीवन की प्रत्येक अवस्था के वैदिक संस्कार — जन्म से विवाह तक, घर से कार्यालय तक।",
    en: "Vedic samskaras for every stage of life — from birth to wedding, home to office.",
  },
  jyotishServices: {
    hi: "जन्म कुंडली आधारित ज्योतिष परामर्श — मार्गदर्शन, मिलान एवं उपाय।",
    en: "Birth-chart-based Vedic astrology — guidance, matching, and remedies.",
  },
};

/** Devotional motifs for each category card. */
export const CATEGORY_MOTIFS: Record<ServiceCategoryValue, string> = {
  vedicPujaHavan: "🔥",
  grahaDoshShanti: "🪐",
  jeevanSamskar: "🪔",
  jyotishServices: "✨",
};
