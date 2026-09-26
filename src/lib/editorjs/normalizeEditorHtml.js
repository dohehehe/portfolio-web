/** Remove execCommand “un-bold” spans that only counter heading UA styles. */
export function stripRedundantFontWeightSpans(html) {
  if (!html) {
    return "";
  }

  if (typeof document === "undefined") {
    return html;
  }

  const root = document.createElement("div");
  root.innerHTML = html;

  root.querySelectorAll("span[style]").forEach((span) => {
    const style = span.getAttribute("style") || "";
    const resetsWeight = /font-weight\s*:\s*(normal|400|lighter)\b/i.test(style);
    const hasBoldChild = span.querySelector("b, strong");

    if (!resetsWeight || hasBoldChild) {
      return;
    }

    const parent = span.parentNode;
    if (!parent) {
      return;
    }

    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });

  return root.innerHTML;
}

export function normalizeEditorHtml(html) {
  if (!html) {
    return html;
  }

  const withoutNbsp = html.replace(/&nbsp;/gi, " ").replace(/\u00A0/g, " ");
  return stripRedundantFontWeightSpans(withoutNbsp);
}

export function getCaptionPlainText(html) {
  if (!html) {
    return "";
  }

  return normalizeEditorHtml(html).replace(/<[^>]*>/g, "").trim();
}
