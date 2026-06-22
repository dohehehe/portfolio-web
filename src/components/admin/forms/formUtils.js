export async function saveEditorContent(editorRef, label) {
  if (!editorRef.current?.isReady()) {
    throw new Error(`${label} 에디터가 준비되지 않았습니다.`);
  }

  const data = await editorRef.current.save();
  return data.blocks?.length ? data : null;
}

export function parseGalleryJson(rawValue) {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return null;
  }

  return JSON.parse(trimmed);
}
