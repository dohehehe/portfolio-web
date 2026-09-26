/** Shared Editor.js sanitizer rules for HTML inline formatting. */
export function getPlainTextFromEditorHtml(html) {
  if (!html) {
    return "";
  }

  if (typeof document !== "undefined") {
    const element = document.createElement("div");
    element.innerHTML = html;
    return (element.textContent || "")
      .replace(/\uFEFF/g, "")
      .replace(/\u00A0/g, " ")
      .trim();
  }

  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

export const inlineTextSanitize = {
  br: true,
  b: true,
  strong: true,
  i: true,
  em: true,
  u: true,
  sup: true,
  a: {
    href: true,
    target: true,
    rel: true,
  },
};

export { stripRedundantFontWeightSpans as normalizeInlineEditorHtml } from "@/lib/editorjs/normalizeEditorHtml";
