// Quote picker options for the admin quote drawer.
// The visible dropdown now mirrors the "Features & Functionality" options from contact.html.
// Internal presets remain available for quote prefill logic, but are not shown in the picker.

export const FEATURE_CATALOG = [
  { key: 'whatsapp_integration',    name: { en: 'WhatsApp integration', ar: 'تكامل واتساب' }, defaultPrice: 0 },
  { key: 'booking_system',          name: { en: 'Booking system', ar: 'نظام الحجوزات' }, defaultPrice: 0 },
  { key: 'online_payments',         name: { en: 'Online payments', ar: 'الدفع الإلكتروني' }, defaultPrice: 0 },
  { key: 'multi_language',          name: { en: 'Multi-language', ar: 'متعدد اللغات' }, defaultPrice: 0 },
  { key: 'admin_dashboard',         name: { en: 'Admin dashboard', ar: 'لوحة تحكم إدارية' }, defaultPrice: 0 },
  { key: 'crm_integration',         name: { en: 'CRM integration', ar: 'تكامل CRM' }, defaultPrice: 0 },
  { key: 'ai_chatbot',              name: { en: 'AI chatbot', ar: 'مساعد ذكي بالذكاء الاصطناعي' }, defaultPrice: 0 },
  { key: 'inventory_management',    name: { en: 'Inventory management', ar: 'إدارة المخزون' }, defaultPrice: 0 },
  { key: 'order_tracking',          name: { en: 'Order tracking', ar: 'تتبع الطلبات' }, defaultPrice: 0 },
  { key: 'analytics_dashboard',     name: { en: 'Analytics dashboard', ar: 'لوحة التحليلات' }, defaultPrice: 0 },
  { key: 'gallery',                 name: { en: 'Gallery', ar: 'معرض الصور' }, defaultPrice: 0 },
  { key: 'blog',                    name: { en: 'Blog', ar: 'المدونة' }, defaultPrice: 0 },
  { key: 'maps',                    name: { en: 'Maps', ar: 'الخرائط' }, defaultPrice: 0 },
  { key: 'reviews',                 name: { en: 'Reviews', ar: 'التقييمات' }, defaultPrice: 0 },
  { key: 'newsletter',              name: { en: 'Newsletter', ar: 'النشرة البريدية' }, defaultPrice: 0 },
  { key: 'file_uploads',            name: { en: 'File uploads', ar: 'رفع الملفات' }, defaultPrice: 0 },
  { key: 'user_accounts',           name: { en: 'User accounts', ar: 'حسابات المستخدمين' }, defaultPrice: 0 },
  { key: 'loyalty_systems',         name: { en: 'Loyalty systems', ar: 'أنظمة الولاء' }, defaultPrice: 0 },
  { key: 'memberships',             name: { en: 'Memberships', ar: 'العضويات' }, defaultPrice: 0 },
  { key: 'social_feeds',            name: { en: 'Social feeds', ar: 'عرض وسائل التواصل' }, defaultPrice: 0 },
  { key: 'team_portals',            name: { en: 'Team portals', ar: 'بوابات الفريق' }, defaultPrice: 0 },
  { key: 'not_sure_recommend_stack', name: { en: 'Not sure — recommend the right stack', ar: 'غير متأكد — اقترحوا النظام المناسب' }, defaultPrice: 0 }
];

export const INTERNAL_CATALOG = [
  { key: 'site-5p',         name: { en: '5-page responsive website', ar: 'موقع متجاوب ٥ صفحات' }, defaultPrice: 3500 },
  { key: 'site-10p',        name: { en: '10-page responsive website', ar: 'موقع متجاوب ١٠ صفحات' }, defaultPrice: 5500 },
  { key: 'logo-design',     name: { en: 'Logo design (3 concepts, 2 revs)', ar: 'تصميم شعار (٣ مفاهيم، مراجعتان)' }, defaultPrice: 1200 },
  { key: 'maintenance-3m',  name: { en: '3-month maintenance', ar: 'صيانة ٣ أشهر' }, defaultPrice: 1500 }
];

export const CATALOG = FEATURE_CATALOG;

const ALL_CATALOG_ITEMS = [...FEATURE_CATALOG, ...INTERNAL_CATALOG];

export function getCatalogItem(key) {
  return ALL_CATALOG_ITEMS.find((c) => c.key === key) || null;
}

export function catalogToLineItem(key, overrides = {}) {
  const c = getCatalogItem(key);
  if (!c) return null;

  return {
    catalogKey: c.key,
    name: { en: c.name.en, ar: c.name.ar },
    description: { en: '', ar: '' },
    qty: 1,
    unitPrice: c.defaultPrice,
    ...overrides
  };
}
