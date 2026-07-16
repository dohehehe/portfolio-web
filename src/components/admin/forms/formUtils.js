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

      const imgUrl = item.img_url ?? item.file_url ?? "";

      return {
        img_url: imgUrl,
        video_url: item.video_url ?? "",
        width: item.width ?? item.img_width ?? null,
        height: item.height ?? item.img_height ?? null,
        caption_ko: item.caption_ko ?? item.title_ko ?? "",
        caption_en: item.caption_en ?? item.title_en ?? "",
      };
    })
    .filter((item) => item?.img_url || item?.video_url);
}

export function getFirstGalleryImageUrl(rawValue) {
  return normalizeGallery(rawValue).find((item) => item.img_url)?.img_url;
}

export function serializeGallery(items) {
  if (!items?.length) {
    return null;
  }

  return items.map(({ img_url, video_url, width, height, caption_ko, caption_en }) => {
    const trimmedVideoUrl = video_url?.trim() || null;

    if (img_url) {
      return {
        img_url,
        ...(width && height ? { width, height } : {}),
        caption_ko: caption_ko?.trim() || null,
        caption_en: caption_en?.trim() || null,
      };
    }

    return {
      video_url: trimmedVideoUrl,
      caption_ko: caption_ko?.trim() || null,
      caption_en: caption_en?.trim() || null,
    };
  });
}

