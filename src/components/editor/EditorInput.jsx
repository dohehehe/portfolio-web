"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
  loadFootnotesTune,
  scheduleGlobalFootnoteRenumber,
} from "@/lib/editorjs/footnotesTune";
import { normalizeEditorData } from "@/lib/editorjs/normalizeBlocks";
import { getEditorInputPreviewRootClass } from "./inputPreviewThemes";
import styles from "./EditorInput.module.css";

const EditorInput = forwardRef(function EditorInput(
  { data, holderId = "editorjs", preview },
  ref,
) {
  const previewRootClass = getEditorInputPreviewRootClass(preview);
  const editorInstanceRef = useRef(null);
  const initialDataRef = useRef(data);
  const boundHolderIdRef = useRef(holderId);
  const { uploadImageToServer } = useImageUpload();

  if (boundHolderIdRef.current !== holderId) {
    boundHolderIdRef.current = holderId;
    initialDataRef.current = data;
  } else if (initialDataRef.current === undefined && data !== undefined) {
    initialDataRef.current = data;
  }

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorInstanceRef.current) {
        throw new Error("Editor is not ready");
      }

      return editorInstanceRef.current.save();
    },
    isReady: () => editorInstanceRef.current !== null,
  }));

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let editor = null;
    let cancelled = false;

    const initEditor = async () => {
      try {
        const holder = document.getElementById(holderId);

        if (!holder) {
          console.error("Editor holder not found:", holderId);
          return;
        }

        holder.innerHTML = "";

        const [
          { default: EditorJS },
          { default: EmbedWithInlineCaption },
          { default: HeaderWithInlineFormat },
          { default: ImageWithInlineCaption },
          { default: ParagraphWithInlineFormat },
          FootnotesTune,
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@/components/editor/tools/embedTool"),
          import("@/components/editor/tools/headerTool"),
          import("@/components/editor/tools/imageTool"),
          import("@/components/editor/tools/paragraphTool"),
          loadFootnotesTune(),
        ]);

        if (cancelled) {
          return;
        }

        editor = new EditorJS({
          holder: holderId,
          placeholder: "내용을 입력하세요...",
          tunes: ["footnotes"],
          tools: {
            paragraph: {
              class: ParagraphWithInlineFormat,
              inlineToolbar: ["link", "bold", "italic"],
            },
            footnotes: {
              class: FootnotesTune,
              config: {
                placeholder: "각주 내용을 입력하세요",
                shortcut: "CMD+SHIFT+F",
              },
            },
            header: {
              class: HeaderWithInlineFormat,
              inlineToolbar: ["link", "bold", "italic"],
              config: {
                placeholder: "제목을 입력하세요",
                levels: [1, 2, 3, 4, 5],
                defaultLevel: 2,
              },
            },
            embed: {
              class: EmbedWithInlineCaption,
              inlineToolbar: ["link", "bold", "italic"],
              config: {
                services: {
                  youtube: true,
                },
              },
            },
            image: {
              class: ImageWithInlineCaption,
              inlineToolbar: ["link", "bold", "italic"],
              config: {
                captionPlaceholder: "이미지 설명을 입력하세요",
                buttonContent: "이미지 선택",
                features: {
                  border: false,
                  caption: true,
                  background: false,
                },
                uploader: {
                  uploadByFile: async (file) => {
                    try {
                      const result = await uploadImageToServer(file);

                      if (result?.success && result?.file?.url) {
                        return {
                          success: 1,
                          file: {
                            url: result.file.url,
                            width: result.file.width,
                            height: result.file.height,
                          },
                        };
                      }

                      return {
                        success: 0,
                        error: result?.error || "업로드 실패",
                      };
                    } catch (error) {
                      console.error("Editor 이미지 업로드 에러:", error);
                      return { success: 0, error: error.message };
                    }
                  },
                },
              },
            },
          },
          inlineToolbar: ["link", "bold", "italic"],
          data: normalizeEditorData(initialDataRef.current),
          onChange: (_api, event) => {
            const events = Array.isArray(event) ? event : [event];
            const shouldRenumber = events.some(({ type }) =>
              ["block-moved", "block-added", "block-removed"].includes(type),
            );

            if (shouldRenumber) {
              scheduleGlobalFootnoteRenumber();
            }
          },
        });

        await editor.isReady;

        if (cancelled) {
          await editor.destroy();
          return;
        }

        editorInstanceRef.current = editor;
      } catch (error) {
        console.error("Editor initialization failed:", error);
      }
    };

    const timer = setTimeout(initEditor, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);

      if (
        editorInstanceRef.current &&
        typeof editorInstanceRef.current.destroy === "function"
      ) {
        try {
          editorInstanceRef.current.destroy();
        } catch (error) {
          console.warn("Editor destroy failed:", error);
        }

        editorInstanceRef.current = null;
      }
    };
  }, [holderId]);

  const wrapperClassName = [styles.wrapper, previewRootClass && styles.withPreview]
    .filter(Boolean)
    .join(" ");
  const holderClassName = [styles.holder, styles.previewRoot, previewRootClass]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      <div
        id={holderId}
        className={holderClassName}
        suppressHydrationWarning
      />
    </div>
  );
});

EditorInput.displayName = "EditorInput";

export default EditorInput;
