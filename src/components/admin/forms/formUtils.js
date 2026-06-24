export async function saveEditorContent(editorRef, label) {
  if (!editorRef.current?.isReady()) {
    throw new Error(`${label} 에디터가 준비되지 않았습니다.`);
  }

  const data = await editorRef.current.save();
  return data.blocks?.length ? data : null;
}

export function normalizeGallery(rawValue) {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .map((item) => {
      if (typeof item === "string") {
        return {
          img_url: item,
          caption_ko: "",
          caption_en: "",
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        img_url: item.img_url ?? "",
        caption_ko: item.caption_ko ?? "",
        caption_en: item.caption_en ?? "",
      };
    })
    .filter((item) => item?.img_url);
}

export function serializeGallery(items) {
  if (!items?.length) {
    return null;
  }

  return items.map(({ img_url, caption_ko, caption_en }) => ({
    img_url,
    caption_ko: caption_ko?.trim() || null,
    caption_en: caption_en?.trim() || null,
  }));
}

export function normalizeFileLink(rawValue) {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .map((item) => {
      if (typeof item === "string") {
        return {
          file_url: item,
          title_ko: "",
          title_en: "",
        };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        file_url: item.file_url ?? "",
        title_ko: item.title_ko ?? "",
        title_en: item.title_en ?? "",
      };
    })
    .filter((item) => item?.file_url);
}

export function serializeFileLink(items) {
  if (!items?.length) {
    return null;
  }

  return items.map(({ file_url, title_ko, title_en }) => ({
    file_url,
    title_ko: title_ko?.trim() || null,
    title_en: title_en?.trim() || null,
  }));
}
