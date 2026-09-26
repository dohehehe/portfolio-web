import eventContentStyles from "@/components/event/detail/editor/EventEditorContent.module.css";
import eventCreditStyles from "@/components/event/detail/editor/EventEditorCredit.module.css";
import textContentStyles from "@/components/text/TextEditor.module.css";
import projectStyles from "@/components/work/project/item-detail/ProjectItemDetail.module.css";
import workStyles from "@/components/work/work/WorkItemDetail.module.css";

/** @typedef {'work-content' | 'work-credit' | 'project-content' | 'project-credit' | 'event-content' | 'event-credit' | 'text-content'} EditorInputPreviewKey */

/** @type {Record<EditorInputPreviewKey, string | undefined>} */
const PREVIEW_ROOT_CLASS = {
  "work-content": workStyles.editorContent,
  "work-credit": workStyles.creditRow,
  "project-content": projectStyles.editorContent,
  "project-credit": projectStyles.creditContent,
  "event-content": eventContentStyles.editorContent,
  "event-credit": eventCreditStyles.editorContent,
  "text-content": textContentStyles.editorContent,
};

/**
 * @param {EditorInputPreviewKey | undefined} preview
 * @returns {string}
 */
export function getEditorInputPreviewRootClass(preview) {
  if (!preview) {
    return "";
  }

  return PREVIEW_ROOT_CLASS[preview] ?? "";
}
