export type Branch = {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  region: "tanta" | "cairo" | "coast";
  addressAr: string;
  addressEn: string;
  phone?: string;
  phone2?: string;
  whatsapp: string;
  hoursAr: string;
  hoursEn: string;
  maps: string;
  main?: boolean;
};

export const HOTLINE = "01200400094";
export const HOTLINE_WA = "201200400094";
export const BRANCHES_WA = "201200400461";
export const COMPLAINTS = "01200400089";
export const SITE = "https://bendaryph.com";
export const INSTAGRAM = "https://www.instagram.com/elbendary_pharmacy1980/";

export const branches: Branch[] = [
  {
    id: "mohandessin",
    nameAr: "المهندسين",
    nameEn: "Mohandessin",
    cityAr: "الجيزة",
    cityEn: "Giza",
    region: "cairo",
    addressAr: "٦٩ شارع شهاب — تقاطع لبنان، بجوار مزايا",
    addressEn: "69 Shehab St., Lebanon intersection, beside Mazaya",
    phone: "0233463222",
    phone2: "01210222822",
    whatsapp: "201210222822",
    hoursAr: "١٠ صباحاً – ٢ بعد منتصف الليل",
    hoursEn: "10:00–02:00",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Mohandessin+Shehab",
  },
  {
    id: "galaa-1",
    nameAr: "شارع الجلاء (١)",
    nameEn: "El Galaa St. (1)",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "أمام موقف الجلاء — ٢٤ شارع الجلاء",
    addressEn: "Opposite the Galaa stop, 24 El Galaa St.",
    phone: "0403298793",
    phone2: "01207222322",
    whatsapp: "201200400094",
    hoursAr: "٢٤ ساعة",
    hoursEn: "Open 24/7",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+El+Galaa+Tanta",
    main: true,
  },
  {
    id: "galaa-2",
    nameAr: "شارع الجلاء (٢)",
    nameEn: "El Galaa St. (2)",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "أمام قصر جرين بالاس",
    addressEn: "Opposite Green Palace",
    phone: "0403546290",
    whatsapp: "201200400461",
    hoursAr: "٢٤ ساعة",
    hoursEn: "Open 24/7",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+El+Galaa+2+Tanta",
  },
  {
    id: "galaa-3",
    nameAr: "شارع الجلاء (٣)",
    nameEn: "El Galaa St. (3)",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "بجوار الأمن المركزي",
    addressEn: "Beside Central Security",
    phone: "0403282323",
    phone2: "01200400461",
    whatsapp: "201200400461",
    hoursAr: "٢٤ ساعة",
    hoursEn: "Open 24/7",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+El+Galaa+3+Tanta",
  },
  {
    id: "borsa",
    nameAr: "شارع البورصة",
    nameEn: "Borsa Street",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "بجوار قسم أول — أسفل مول الشهاوي",
    addressEn: "Beside Qism Awal, under El Shahawy Mall",
    phone: "0403358874",
    phone2: "01121369758",
    whatsapp: "201200400461",
    hoursAr: "٢٤ ساعة",
    hoursEn: "Open 24/7",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Borsa+Tanta",
  },
  {
    id: "ashraf",
    nameAr: "شارع الأشراف",
    nameEn: "El Ashraf Street",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "مع المرشحة",
    addressEn: "At El Morshaha",
    phone: "0403313012",
    phone2: "01200400459",
    whatsapp: "201200400459",
    hoursAr: "٢٤ ساعة",
    hoursEn: "Open 24/7",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Ashraf+Tanta",
  },
  {
    id: "kafr-essam",
    nameAr: "كفر عصام",
    nameEn: "Kafr Essam",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "بجوار مدرسة أم المؤمنين",
    addressEn: "Beside Om El Mo'menin school",
    phone: "0403332816",
    phone2: "01207271272",
    whatsapp: "201207271272",
    hoursAr: "حسب وردية الفرع",
    hoursEn: "Branch shift hours",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Kafr+Essam",
  },
  {
    id: "saeed",
    nameAr: "شارع سعيد",
    nameEn: "Saeed Street",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "آخر شارع سعيد مع عمر بن عبد العزيز",
    addressEn: "End of Saeed St. at Omar Ibn Abdel Aziz",
    phone: "0403313734",
    phone2: "01200400469",
    whatsapp: "201200400469",
    hoursAr: "حسب وردية الفرع",
    hoursEn: "Branch shift hours",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Saeed+Tanta",
  },
  {
    id: "maared",
    nameAr: "المعارض",
    nameEn: "El Maared",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "طريق القاهرة الزراعي",
    addressEn: "Cairo agricultural road",
    phone: "0403129339",
    phone2: "01200400434",
    whatsapp: "201200400434",
    hoursAr: "حسب وردية الفرع",
    hoursEn: "Branch shift hours",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Maared+Tanta",
  },
  {
    id: "alex-road",
    nameAr: "طريق إسكندرية الزراعي",
    nameEn: "Alex Agricultural Road",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "بعد محطة أندريا",
    addressEn: "After Andrea station",
    phone: "0403344310",
    phone2: "01200400471",
    whatsapp: "201200400471",
    hoursAr: "حسب وردية الفرع",
    hoursEn: "Branch shift hours",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Alex+agricultural+road+Tanta",
  },
  {
    id: "mohafza",
    nameAr: "المحافظة",
    nameEn: "El Mohafza",
    cityAr: "طنطا",
    cityEn: "Tanta",
    region: "tanta",
    addressAr: "أول شارع النحاس من شارع البحر",
    addressEn: "Start of El Nahhas St. from El Bahr St.",
    phone: "0403353406",
    phone2: "01223258957",
    whatsapp: "201223258957",
    hoursAr: "حسب وردية الفرع",
    hoursEn: "Branch shift hours",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Mohafza+Tanta",
  },
  {
    id: "fifth",
    nameAr: "التجمع الخامس",
    nameEn: "Fifth Settlement",
    cityAr: "القاهرة الجديدة",
    cityEn: "New Cairo",
    region: "cairo",
    addressAr: "التجمع الخامس — القاهرة الجديدة",
    addressEn: "Fifth Settlement, New Cairo",
    whatsapp: HOTLINE_WA,
    hoursAr: "حسب وردية الفرع — الخط الساخن يؤكد",
    hoursEn: "Branch shift — hotline confirms",
    maps: "https://www.google.com/maps/search/?api=1&query=Elbendary+pharmacy+Fifth+Settlement",
  },
  {
    id: "october",
    nameAr: "٦ أكتوبر",
    nameEn: "6th of October",
    cityAr: "٦ أكتوبر",
    cityEn: "6th of October",
    region: "cairo",
    addressAr: "مدينة ٦ أكتوبر",
    addressEn: "6th of October City",
    phone: "01068187221",
    whatsapp: "201068187221",
    hoursAr: "مفتوح حسب إعلان الفرع",
    hoursEn: "Posted branch hours",
    maps: "https://www.google.com/maps/search/?api=1&query=Bendary+Pharmacies+6th+of+October",
  },
  {
    id: "zayed",
    nameAr: "الشيخ زايد",
    nameEn: "Sheikh Zayed",
    cityAr: "الشيخ زايد",
    cityEn: "Sheikh Zayed",
    region: "cairo",
    addressAr: "تغطية توصيل داخل الشيخ زايد",
    addressEn: "Delivery coverage inside Sheikh Zayed",
    whatsapp: HOTLINE_WA,
    hoursAr: "توصيل على مدار الساعة في النطاق",
    hoursEn: "Around-the-clock delivery in zone",
    maps: "https://www.google.com/maps/search/?api=1&query=Sheikh+Zayed+Giza",
  },
  {
    id: "hacienda",
    nameAr: "هاسيندا",
    nameEn: "Hacienda",
    cityAr: "الساحل الشمالي",
    cityEn: "North Coast",
    region: "coast",
    addressAr: "هاسيندا كوميرشال ستريب — فرع موسمي",
    addressEn: "Hacienda commercial strip — seasonal branch",
    whatsapp: HOTLINE_WA,
    hoursAr: "موسم الصيف — تأكد من الخط الساخن",
    hoursEn: "Summer season — confirm on the hotline",
    maps: "https://www.google.com/maps/search/?api=1&query=Hacienda+North+Coast+Egypt",
  },
];

export const insurers = [
  "AXA",
  "Misr Insurance",
  "MedNet",
  "Nextcare",
  "GlobeMed",
  "Pure Health",
  "Al-Shefa",
  "Misr Life",
  "Tokio Marine",
  "Bupa Egypt",
  "Allianz",
  "Universal Health Insurance",
];

export type Member = {
  id: string;
  nameAr: string;
  nameEn: string;
  insurer: string;
  planAr: string;
  planEn: string;
  copay: string;
  limit: number;
  used: number;
  branchId: string;
};

export const members: Member[] = [
  {
    id: "BND-AXA-20481",
    nameAr: "نور السيد",
    nameEn: "Nour El-Sayed",
    insurer: "AXA",
    planAr: "ذهبي عائلي",
    planEn: "Gold family",
    copay: "20%",
    limit: 15000,
    used: 4200,
    branchId: "mohandessin",
  },
  {
    id: "BND-MED-11820",
    nameAr: "عمر فتحي",
    nameEn: "Omar Fathy",
    insurer: "MedNet",
    planAr: "عائلي",
    planEn: "Family",
    copay: "15%",
    limit: 8000,
    used: 1900,
    branchId: "galaa-1",
  },
  {
    id: "BND-EGY-00912",
    nameAr: "هالة مصطفى",
    nameEn: "Hala Mostafa",
    insurer: "Misr Insurance",
    planAr: "شركات",
    planEn: "Corporate",
    copay: "10%",
    limit: 20000,
    used: 7600,
    branchId: "fifth",
  },
];

export type Batch = {
  sku: string;
  batch: string;
  branchId: string;
  qty: number;
  expiry: string;
};

export const batches: Batch[] = [
  { sku: "0063657_2", batch: "HS-24118", branchId: "galaa-1", qty: 40, expiry: "2026-12-02" },
  { sku: "GA", batch: "GV-26004", branchId: "galaa-1", qty: 24, expiry: "2027-08-19" },
  { sku: "0071491", batch: "AN-25014", branchId: "mohandessin", qty: 8, expiry: "2027-03-18" },
  { sku: "BAB-01", batch: "SL-25110", branchId: "galaa-2", qty: 36, expiry: "2026-11-28" },
  { sku: "VIT-D", batch: "VD-26077", branchId: "borsa", qty: 50, expiry: "2028-01-09" },
  { sku: "DEV-02", batch: "BP-24990", branchId: "october", qty: 4, expiry: "2029-05-01" },
  { sku: "CLR-05", batch: "CL-26021", branchId: "mohandessin", qty: 12, expiry: "2027-02-14" },
  { sku: "MTH-02", batch: "PN-25102", branchId: "fifth", qty: 14, expiry: "2026-12-20" },
];

export function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

export function branchById(id: string) {
  return branches.find((b) => b.id === id);
}
