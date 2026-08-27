import fs from "node:fs";
import path from "node:path";

const outputRoot = process.argv[2];
if (!outputRoot) throw new Error("Usage: node scripts/generate-pages.mjs <output-directory>");

const siteUrl = "https://tandumstudio.github.io/nomadia-qr/";
const source = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const locales = {
  en: { path: "", lang: "en", og: "en_US", listTitle: "NOMADIA | For Sensitive Skin", listDescription: "NOMADIA sensitive-skin cleansers: Blue Calming Panthenol 1% Cleansing Milk and Golden Jojoba 10% Dual Micro-bubble Cleanser.", listAlt: "NOMADIA sensitive-skin cleansers" },
  ko: { path: "ko/", lang: "ko", og: "ko_KR", listTitle: "NOMADIA | 민감성 피부를 위한 클렌저", listDescription: "민감성 피부를 위한 NOMADIA 클렌저: 블루 진정 판테놀 1% 클렌징 밀크와 골든 호호바 10% 듀얼 마이크로 버블 클렌저.", listAlt: "민감성 피부를 위한 NOMADIA 클렌저" },
  "zh-CN": { path: "zh-cn/", lang: "zh-CN", og: "zh_CN", listTitle: "NOMADIA | 敏感肌洁面产品", listDescription: "NOMADIA敏感肌洁面产品：蓝色舒缓泛醇1%洁颜乳与黄金荷荷巴10%双层微气泡洁颜啫喱。", listAlt: "NOMADIA敏感肌洁面产品" },
  "zh-TW": { path: "zh-tw/", lang: "zh-TW", og: "zh_TW", listTitle: "NOMADIA | 敏感肌潔顏產品", listDescription: "NOMADIA敏感肌潔顏產品：藍色舒緩泛醇1%潔顏乳與黃金荷荷巴10%雙層微氣泡潔顏凝膠。", listAlt: "NOMADIA敏感肌潔顏產品" },
  ja: { path: "ja/", lang: "ja", og: "ja_JP", listTitle: "NOMADIA | 敏感肌のためのクレンザー", listDescription: "敏感肌のためのNOMADIAクレンザー：ブルー カーミング パンテノール1% クレンジングミルクとゴールデン ホホバ10% デュアル マイクロバブル クレンザー。", listAlt: "敏感肌のためのNOMADIAクレンザー" },
  th: { path: "th/", lang: "th", og: "th_TH", listTitle: "NOMADIA | ผลิตภัณฑ์ทำความสะอาดสำหรับผิวแพ้ง่าย", listDescription: "ผลิตภัณฑ์ทำความสะอาด NOMADIA สำหรับผิวแพ้ง่าย: บลู คาล์มมิ่ง แพนธีนอล 1% คลีนซิ่งมิลค์ และ โกลเด้น โจโจบา 10% ดูอัล ไมโครบับเบิ้ล คลีนเซอร์", listAlt: "ผลิตภัณฑ์ทำความสะอาด NOMADIA สำหรับผิวแพ้ง่าย" },
};
const products = {
  milk: {
    image: "thumbnail/og-milk.png",
    names: { en: "Blue Calming Panthenol 1% Cleansing Milk", ko: "블루 진정 판테놀 1% 클렌징 밀크", "zh-CN": "蓝色舒缓泛醇1%洁颜乳", "zh-TW": "藍色舒緩泛醇1%潔顏乳", ja: "ブルー カーミング パンテノール1% クレンジングミルク", th: "บลู คาล์มมิ่ง แพนธีนอล 1% คลีนซิ่งมิลค์" },
    descriptions: { en: "A creamy milk that soothes and protects skin while cleansing", ko: "완전히 씻겨나가는 크리미 클렌징 밀크 — 민감성 피부를 위해.", "zh-CN": "洗后不留残留的丝滑洁颜乳 —— 专为敏感肌设计。", "zh-TW": "洗後不留殘留的絲滑潔顏乳 —— 專為敏感肌設計。", ja: "洗い流したあと、何も残らないクリーミーなミルク。敏感肌のために。", th: "มิลค์คลีนซิ่งเนื้อครีมที่ล้างออกได้หมดจด — เพื่อผิวแพ้ง่ายโดยเฉพาะ" },
  },
  bubble: {
    image: "thumbnail/og-bubble.png",
    names: { en: "Golden Jojoba 10% Dual Micro-bubble Cleanser", ko: "골든 호호바 10% 듀얼 마이크로 버블 클렌저", "zh-CN": "黄金荷荷巴10%双层微气泡洁颜啫喱", "zh-TW": "黃金荷荷巴10%雙層微氣泡潔顏凝膠", ja: "ゴールデン ホホバ10% デュアル マイクロバブル クレンザー", th: "โกลเด้น โจโจบา 10% ดูอัล ไมโครบับเบิ้ล คลีนเซอร์" },
    descriptions: { en: "Shake to wake the dual bubble - combining the benefits of a low-ph cleanser and mosturizing oils", ko: "흔들어 깨우는 듀얼 버블 — 오일층과 워터층이 함께 씻어냅니다.", "zh-CN": "摇一摇唤醒双层气泡 —— 油层与水层协同清洁。", "zh-TW": "搖一搖喚醒雙層氣泡 —— 油層與水層協同潔淨。", ja: "振って目覚めるデュアルバブル。オイル層とウォーター層がともに洗い上げます。", th: "เขย่าปลุกฟองบับเบิ้ลสองชั้น — ชั้นน้ำมันและชั้นน้ำทำงานร่วมกันในการทำความสะอาด" },
  },
};
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const canonicalFor = (locale, product) => `${siteUrl}${locales[locale].path}${product ? `${product}/` : ""}`;
function metadata(locale, productKey) {
  const localeInfo = locales[locale];
  const product = productKey ? products[productKey] : null;
  const title = product ? `${product.names[locale]} | NOMADIA` : localeInfo.listTitle;
  const description = product ? product.descriptions[locale] : localeInfo.listDescription;
  const image = `${siteUrl}${product ? product.image : "thumbnail/og-nomadia.png"}`;
  const imageAlt = product ? `${product.names[locale]} — NOMADIA` : localeInfo.listAlt;
  const canonical = canonicalFor(locale, productKey);
  const alternates = Object.entries(locales).map(([code, info]) => `<link rel="alternate" hreflang="${info.lang}" href="${canonicalFor(code, productKey)}">`).join("\n");
  const ogAlternates = Object.entries(locales).filter(([code]) => code !== locale).map(([, info]) => `<meta property="og:locale:alternate" content="${info.og}">`).join("\n");
  return `<!-- NOMADIA_PAGE_META_START -->
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canonical}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${canonicalFor("en", productKey)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NOMADIA">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${localeInfo.og}">
${ogAlternates}
<meta property="og:image" content="${image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">
<!-- NOMADIA_PAGE_META_END -->`;
}
const pages = [];
for (const locale of Object.keys(locales)) {
  for (const product of [null, ...Object.keys(products)]) {
    const route = `${locales[locale].path}${product ? `${product}/` : ""}`;
    const html = source.replace(/<html lang="[^"]+">/, `<html lang="${locales[locale].lang}">`).replace(/<!-- NOMADIA_PAGE_META_START -->[\s\S]*?<!-- NOMADIA_PAGE_META_END -->/, metadata(locale, product));
    const destination = path.join(outputRoot, route, "index.html");
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, html);
    pages.push({ locale, product, route, destination, canonical: canonicalFor(locale, product) });
  }
}
const requiredFragments = ['<meta name="description"', '<link rel="canonical"', 'hreflang="x-default"', '<meta property="og:type"', '<meta property="og:site_name"', '<meta property="og:title"', '<meta property="og:description"', '<meta property="og:url"', '<meta property="og:locale"', '<meta property="og:image"', '<meta property="og:image:type" content="image/png"', '<meta property="og:image:width" content="1200"', '<meta property="og:image:height" content="630"', '<meta property="og:image:alt"', '<meta name="twitter:card" content="summary_large_image"', '<meta name="twitter:title"', '<meta name="twitter:description"', '<meta name="twitter:image"', '<meta name="twitter:image:alt"'];
if (pages.length !== 18) throw new Error(`Expected 18 routes, generated ${pages.length}`);
for (const page of pages) {
  const html = fs.readFileSync(page.destination, "utf8");
  for (const fragment of requiredFragments) if (!html.includes(fragment)) throw new Error(`${page.route || "/"} missing ${fragment}`);
  if (!html.includes(`<html lang="${locales[page.locale].lang}">`)) throw new Error(`${page.route || "/"} has wrong html lang`);
  if (!html.includes(`<link rel="canonical" href="${page.canonical}">`)) throw new Error(`${page.route || "/"} has wrong canonical`);
  if (!html.includes(`<meta property="og:url" content="${page.canonical}">`)) throw new Error(`${page.route || "/"} has wrong og:url`);
  for (const locale of Object.keys(locales)) {
    const reciprocal = `<link rel="alternate" hreflang="${locales[locale].lang}" href="${canonicalFor(locale, page.product)}">`;
    if (!html.includes(reciprocal)) throw new Error(`${page.route || "/"} missing reciprocal ${locale}`);
  }
}
for (const file of ["og-nomadia.png", "og-milk.png", "og-bubble.png"]) {
  const png = fs.readFileSync(new URL(`../thumbnail/${file}`, import.meta.url));
  if (png.toString("ascii", 1, 4) !== "PNG") throw new Error(`${file} is not PNG`);
  if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) throw new Error(`${file} is not 1200x630`);
}
console.log(`generated and validated ${pages.length} canonical pages`);
