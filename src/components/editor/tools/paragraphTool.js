import Paragraph from "@editorjs/paragraph";
import {
  getPlainTextFromEditorHtml,
  inlineTextSanitize,
} from "./inlineTextSanitize";

const paragraphTextSanitize = {
  ...inlineTextSanitize,
  sup: {
    "data-tune": true,
    "data-id": true,
  },
};

function resolveParagraphElement(element, fallbackElement) {
  const candidate = fallbackElement ?? element;

  if (!candidate) {
    return null;
  }

  if (candidate.classList?.contains("ce-paragraph")) {
    return candidate;
  }

  return candidate.querySelector?.(".ce-paragraph") ?? candidate;
}

/**
 * Paragraph with footnote sup tags + reliable save/validate with footnotes wrapper.
 */
export default class ParagraphWithInlineFormat extends Paragraph {
  static get sanitize() {
    return {
      text: paragraphTextSanitize,
    };
  }

  save(element) {
    const paragraphEl = resolveParagraphElement(element, this._element);
    return {
      text: paragraphEl?.innerHTML ?? "",
    };
  }

  validate(savedData) {
    if (this._preserveBlank) {
      return true;
    }

    return getPlainTextFromEditorHtml(savedData?.text).length > 0;
  }
}
