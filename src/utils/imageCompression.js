import {
  IMAGE_UPLOAD_MAX_DIMENSION,
  IMAGE_UPLOAD_MAX_SIZE_MB,
  IMAGE_UPLOAD_WEBP_QUALITY,
} from "@/lib/imageUpload/constants";

function scaleToMaxDimension(width, height, maxDimension) {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  if (width >= height) {
    return {
      width: maxDimension,
      height: Math.max(Math.round((height * maxDimension) / width), 1),
    };
  }

  return {
    width: Math.max(Math.round((width * maxDimension) / height), 1),
    height: maxDimension,
  };
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지 로드 실패"));
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("파일 읽기 실패"));
    reader.readAsDataURL(file);
  });
}

function encodeCanvasToWebp(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("이미지 압축 실패"));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

function toWebpFile(blob, originalName) {
  const newName = originalName.replace(/\.[^/.]+$/, ".webp");

  return new File([blob], newName, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export async function compressImageForUpload(
  file,
  {
    maxSizeInMB = IMAGE_UPLOAD_MAX_SIZE_MB,
    maxDimension = IMAGE_UPLOAD_MAX_DIMENSION,
    webpQuality = IMAGE_UPLOAD_WEBP_QUALITY,
  } = {},
) {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.type === "image/gif") {
    if (file.size > maxSizeInBytes) {
      throw new Error(`GIF는 ${maxSizeInMB}MB 이하여야 합니다.`);
    }

    return file;
  }

  const img = await loadImageFromFile(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let quality = webpQuality;
  let currentMaxDim = maxDimension;
  const minDimension = 640;

  while (true) {
    const { width, height } = scaleToMaxDimension(
      img.width,
      img.height,
      currentMaxDim,
    );

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await encodeCanvasToWebp(canvas, quality);

    if (blob.size <= maxSizeInBytes) {
      return toWebpFile(blob, file.name);
    }

    if (quality > 0.5) {
      quality = Math.max(0.5, quality - 0.05);
      continue;
    }

    if (currentMaxDim > minDimension) {
      currentMaxDim = Math.max(minDimension, Math.floor(currentMaxDim * 0.9));
      quality = webpQuality;
      continue;
    }

    throw new Error(
      `이미지를 ${maxSizeInMB}MB 이하로 압축할 수 없습니다.`,
    );
  }
}

export async function checkAndCompressImage(file, options = {}) {
  return compressImageForUpload(file, options);
}

export {
  IMAGE_UPLOAD_MAX_DIMENSION,
  IMAGE_UPLOAD_MAX_SIZE_MB,
  IMAGE_UPLOAD_WEBP_QUALITY,
} from "@/lib/imageUpload/constants";
