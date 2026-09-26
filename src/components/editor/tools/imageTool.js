import ImageTool from "@editorjs/image";
import { inlineTextSanitize } from "./inlineTextSanitize";

/** Image block with caption inline formatting preserved on save. */
export default class ImageWithInlineCaption extends ImageTool {
  static get sanitize() {
    return {
      caption: inlineTextSanitize,
      file: {
        url: true,
        width: true,
        height: true,
      },
    };
  }
}
