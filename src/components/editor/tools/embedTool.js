import Embed from "@editorjs/embed";
import { inlineTextSanitize } from "./inlineTextSanitize";

export default class EmbedWithInlineCaption extends Embed {
  static get sanitize() {
    return {
      embed: true,
      source: true,
      service: true,
      caption: inlineTextSanitize,
    };
  }
}
