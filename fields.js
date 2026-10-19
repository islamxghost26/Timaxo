/* fields.js — استخراج الحقول من نص الـOCR (تواريخ، هواتف، بريد، روابط، رقم قومي، مبالغ)
   كله على الجهاز بدون أي مكتبة خارجية. */
(function (g) {
  'use strict';

  // تحويل الأرقام العربية/الفارسية لأرقام لاتينية (حرف بحرف عشان مواضع النص متتغيّرش)
  const AR = '٠١٢٣٤٥٦٧٨٩', FA = '۰۱۲۳۴۵۶۷۸۹';
  const norm = s => s.replace(/[٠-٩۰-۹]/g, c => {
    const i = AR.indexOf(c);
    return String(i >= 0 ? i : FA.indexOf(c));
  });

  const MONTHS = {
    يناير: 1, فبراير: 2, مارس: 3, أبريل: 4, ابريل: 4, مايو: 5, يونيو: 6, يوليو: 7, أغسطس: 8, اغسطس: 8,
    سبتمبر: 9, أكتوبر: 10, اكتوبر: 10, نوفمبر: 11, ديسمبر: 12,
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  const GOV = {
    '01': 'القاهرة', '02': 'الإسكندرية', '03': 'بورسعيد', '04': 'السويس', '11': 'دمياط', '12': 'الدقهلية',
    '13': 'الشرقية', '14': 'القليوبية', '15': 'كفر الشيخ', '16': 'الغربية', '17': 'المنوفية', '18': 'البحيرة',
    '19': 'الإسماعيلية', '21': 'الجيزة', '22': 'بني سويف', '23': 'الفيوم', '24': 'المنيا', '25': 'أسيوط',
    '26': 'سوهاج', '27': 'قنا', '28': 'أسوان', '29': 'الأقصر', '31': 'البحر الأحمر', '32': 'الوادي الجديد',
    '33': 'مطروح', '34': 'شمال سيناء', '35': 'جنوب سيناء', '88': 'مولود بالخارج'
  };

  const pad = n => String(n).padStart(2, '0');
  const validDate = (y, m, d) => {
    if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1) return false;
    return d <= new Date(y, m, 0).getDate();
  };
  const fixYear = y => (y < 100 ? (y > 70 ? 1900 + y : 2000 + y) : y);

  // كل قاعدة: نمط regex + دالة تبني الحقل (أو ترجع null لو مش صالح)
  const RULES = [
    {
      type: 'email',
      re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g,
      make: m => ({ value: m[0].toLowerCase() })
    },
    {
      type: 'url',
      re: /\b(?:https?:\/\/|www\.)[^\s<>"')،]+/gi,
      make: m => ({ value: m[0].replace(/[.,;:]+$/, '') })
    },
    {
      // رقم قومي مصري 14 رقم (يقبل مسافات/شرطات بين الأرقام)
      type: 'national_id',
      re: /(?<!\d)[23](?:[\s-]?\d){13}(?!\d)/g,
      make: m => {
        const v = m[0].replace(/\D/g, '');
        const y = (v[0] === '2' ? 1900 : 2000) + +v.slice(1, 3), mo = +v.slice(3, 5), d = +v.slice(5, 7);
        if (!validDate(y, mo, d)) return null;
        return {
          value: v,
          info: {
            birth: y + '-' + pad(mo) + '-' + pad(d),
            governorate: GOV[v.slice(7, 9)] || null,
            gender: (+v[12]) % 2 ? 'ذكر' : 'أنثى'
          }
        };
      }
    },
    {
      // موبايل مصري: 01x xxxxxxxx أو +20 1x ...
      type: 'phone',
      re: /(?<![\d+])(?:\+?20[\s-]?|0)1[0125](?:[\s-]?\d){8}(?!\d)/g,
      make: m => {
        let v = m[0].replace(/[\s-]/g, '');
        v = v.replace(/^\+?20/, '0');
        return v.length === 11 ? { value: v, info: { kind: 'mobile' } } : null;
      }
    },
    {
      // رقم دولي عام (+ ثم 8–14 رقم)
      type: 'phone',
      re: /(?<![\d+])\+(?!20)\d(?:[\s-]?\d){7,13}(?!\d)/g,
      make: m => ({ value: m[0].replace(/[\s-]/g, ''), info: { kind: 'intl' } })
    },
    {
      // تاريخ رقمي: 25/12/2024 أو 2024-12-25 أو 25.12.24
      type: 'date',
      re: /(?<!\d)(?:(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})|(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4}|\d{2}))(?!\d)/g,
      make: m => {
        let y, mo, d;
        if (m[1]) { y = +m[1]; mo = +m[2]; d = +m[3]; }
        else { d = +m[4]; mo = +m[5]; y = fixYear(+m[6]); }
        if (!validDate(y, mo, d)) return null;
        return { value: y + '-' + pad(mo) + '-' + pad(d) };
      }
    },
    {
      // تاريخ بالاسم: 25 ديسمبر 2024 / 5 Mar 2025
      type: 'date',
      re: /(?<!\d)(\d{1,2})\s+([A-Za-z\u0621-\u064A]{3,9})\.?,?\s+(\d{4})(?!\d)/g,
      make: m => {
        const key = m[2].toLowerCase();
        const mo = MONTHS[key] || MONTHS[key.slice(0, 3)];
        const d = +m[1], y = +m[3];
        return mo && validDate(y, mo, d) ? { value: y + '-' + pad(mo) + '-' + pad(d) } : null;
      }
    },
    {
      // مبلغ: 1,250.50 جنيه / EGP 300 / $45
      type: 'amount',
      re: /(?:(?:EGP|USD|EUR|SAR|AED|ج\.?م|جنيه|ريال|درهم|دولار|[$€£])\s*(\d[\d,]*(?:\.\d{1,2})?)|(\d[\d,]*(?:\.\d{1,2})?)\s*(?:EGP|USD|EUR|SAR|AED|ج\.?م|جنيه|ريال|درهم|دولار|[$€£]))/gi,
      make: m => {
        const n = (m[1] || m[2]).replace(/,/g, '');
        return isNaN(+n) ? null : { value: n, info: { text: m[0].trim() } };
      }
    }
  ];

  /** يرجّع قايمة حقول مرتبة حسب موضعها في النص، من غير تداخل. */
  function extract(text) {
    if (!text) return [];
    const t = norm(String(text));
    const out = [];
    for (const r of RULES) {
      r.re.lastIndex = 0;
      let m;
      while ((m = r.re.exec(t))) {
        const f = r.make(m);
        if (!f) continue;
        out.push(Object.assign({ type: r.type, raw: text.substr(m.index, m[0].length), start: m.index, end: m.index + m[0].length }, f));
      }
    }
    // أولوية للأنواع الأخص: لو حقلين اتداخلوا، الأطول/الأخص يكسب
    const PRI = { email: 0, url: 1, national_id: 2, phone: 3, date: 4, amount: 5 };
    out.sort((a, b) => a.start - b.start || PRI[a.type] - PRI[b.type] || (b.end - b.start) - (a.end - a.start));
    const res = [];
    let lastEnd = -1;
    for (const f of out) {
      if (f.start >= lastEnd) { res.push(f); lastEnd = f.end; }
    }
    // شيل التكرار
    const seen = new Set();
    return res.filter(f => { const k = f.type + '|' + f.value; return seen.has(k) ? false : (seen.add(k), true); });
  }

  /** اقتراحات ذكية فوق النص: لكل حقل إجراء مناسب. */
  function suggest(fields, ar) {
    const L = (a, b) => (ar ? a : b);
    const act = {
      email: f => ({ label: L('إرسال بريد', 'Send email'), href: 'mailto:' + f.value }),
      url: f => ({ label: L('فتح الرابط', 'Open link'), href: /^https?:/i.test(f.value) ? f.value : 'https://' + f.value }),
      phone: f => ({ label: L('اتصال', 'Call'), href: 'tel:' + f.value.replace(/^0/, '+20') }),
      date: f => ({ label: L('إضافة لتقويمي', 'Add to calendar'), ics: f.value }),
      national_id: () => null,
      amount: () => null
    };
    return fields.map(f => Object.assign({}, f, { action: (act[f.type] || (() => null))(f) }));
  }

  g.TXFields = { extract, suggest, norm };
  if (typeof module !== 'undefined') module.exports = g.TXFields;
})(typeof window !== 'undefined' ? window : globalThis);
