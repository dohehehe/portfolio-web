import Header from "@editorjs/header";
import {
  getPlainTextFromEditorHtml,
  inlineTextSanitize,
  normalizeInlineEditorHtml,
} from "./inlineTextSanitize";

/**
 * Header with inline bold/italic/link preserved on save (default Header strips them).
 */
export default class HeaderWithInlineFormat extends Header {
  static get sanitize() {
    return {
      level: false,
      text: inlineTextSanitize,
    };
  }

  getTag() {
    const element = super.getTag();
    element.dataset.level = String(this.currentLevel.number);
    return element;
  }

  save(element) {
    const saved = super.save(element);
    return {
      ...saved,
      text: normalizeInlineEditorHtml(saved.text),
    };
  }

  validate(savedData) {
    return getPlainTextFromEditorHtml(savedData?.text).length > 0;
  }
}
