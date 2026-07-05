export function resolveImageDimensions(source) {
  if (!source) {
    return null;
  }

  const width = source.width ?? source.img_width ?? source.naturalWidth;
  const height = source.height ?? source.img_height ?? source.naturalHeight;

  if (!width || !height) {
    return null;
  }

  return { width, height };
}

export async function readImageDimensionsFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => reject(new Error("이미지 로드 실패"));
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("파일 읽기 실패"));
    reader.readAsDataURL(file);
  });
}
