import { normalizeEditorHtml } from "@/lib/editorjs/normalizeEditorHtml";

export default function Caption({ as: Tag = "figcaption", className = "", text }) {
  if (!text) {
    return null;
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: normalizeEditorHtml(text) }}
    />
  );
}
