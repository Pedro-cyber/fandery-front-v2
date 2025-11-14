"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCanonical = void 0;
const scully_1 = require("@scullyio/scully");
const PLUGIN_NAME = 'addCanonical';
const addCanonical = async (html, route) => {
    try {
        const baseUrl = 'https://www.fandery.com';
        const path = (route === null || route === void 0 ? void 0 : route.route) || (route === null || route === void 0 ? void 0 : route.rawRoute) || '/';
        const url = baseUrl + (path.startsWith('/') ? path : `/${path}`);
        const canonicalTag = `<link rel="canonical" href="${url}" />`;
        const hreflangTag = `<link rel="alternate" hreflang="es-ES" href="${url}" />`;
        const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="${url}" />`;
        const ogUrlTag = `<meta property="og:url" content="${url}" />`;
        // --- 1️⃣ Reemplazar o insertar canonical ---
        const canonicalRegex = /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i;
        if (canonicalRegex.test(html)) {
            html = html.replace(canonicalRegex, canonicalTag);
        }
        else {
            html = html.replace(/<head(.*?)>/i, `<head$1>\n  ${canonicalTag}`);
        }
        // --- 2️⃣ Reemplazar o insertar hreflang es-ES ---
        const hreflangRegex = /<link\s+rel=["']alternate["']\s+hreflang=["']es-ES["']\s+href=["'][^"']*["']\s*\/?>/i;
        if (hreflangRegex.test(html)) {
            html = html.replace(hreflangRegex, hreflangTag);
        }
        else {
            html = html.replace(/<head(.*?)>/i, `<head$1>\n  ${hreflangTag}`);
        }
        // --- 3️⃣ Reemplazar o insertar hreflang x-default ---
        const xDefaultRegex = /<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']\s+href=["'][^"']*["']\s*\/?>/i;
        if (xDefaultRegex.test(html)) {
            html = html.replace(xDefaultRegex, xDefaultTag);
        }
        else {
            html = html.replace(/<head(.*?)>/i, `<head$1>\n  ${xDefaultTag}`);
        }
        // --- 4️⃣ Reemplazar o insertar og:url ---
        const ogUrlRegex = /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i;
        if (ogUrlRegex.test(html)) {
            html = html.replace(ogUrlRegex, ogUrlTag);
        }
        else {
            html = html.replace(/<head(.*?)>/i, `<head$1>\n  ${ogUrlTag}`);
        }
        console.log(`[${PLUGIN_NAME}] ✅ Updated canonical, hreflang, x-default, and og:url for ${url}`);
        return html;
    }
    catch (err) {
        console.error(`[${PLUGIN_NAME}] ❌ Error`, err);
        return html;
    }
};
exports.addCanonical = addCanonical;
scully_1.registerPlugin('postProcessByHtml', PLUGIN_NAME, exports.addCanonical);
//# sourceMappingURL=addCanonical.js.map
