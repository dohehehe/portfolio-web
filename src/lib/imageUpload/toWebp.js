import "server-only";

import sharp from "sharp";

import {
  IMAGE_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_MAX_DIMENSION,
  IMAGE_UPLOAD_MAX_QUALITY,
  IMAGE_UPLOAD_MIN_QUALITY,
} from "./constants";

const DIMENSION_STEP = 200;
const MIN_DIMENSION = 3000;

function frameSize(info) {
  const pages = info.pages ?? 1;
  const height =
    pages > 1 && info.height ? Math.round(info.height / pages) : info.height;

  return {
    width: info.width ?? null,
    height: height ?? null,
  };
}

function orientedSize(metadata) {
  const swap =
    metadata.orientation !== undefined &&
    metadata.orientation >= 5 &&
    metadata.orientation <= 8;
  const width = swap ? metadata.height : metadata.width;
  const height = swap
    ? metadata.width
    : (metadata.pageHeight ?? metadata.height);

  return {
    width: width ?? 0,
    height: height ?? 0,
  };
}

async function encodeFitted(buffer, maxDimension, quality) {
  const metadata = await sharp(buffer, {
    animated: true,
    failOn: "none",
  }).metadata();
  const { width, height } = orientedSize(metadata);

  let image = sharp(buffer, {
    animated: true,
    failOn: "none",
  }).rotate();

  if (Math.max(width, height) > maxDimension) {
    image = image.resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const output = await image
    .webp({
      effort: 4,
      quality,
      smartSubsample: true,
    })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: output.data,
    ...frameSize(output.info),
  };
}

async function findBestQuality(buffer, maxDimension) {
  let low = IMAGE_UPLOAD_MIN_QUALITY;
  let high = IMAGE_UPLOAD_MAX_QUALITY;
  let best = null;

  while (low <= high) {
    const quality = Math.round((low + high) / 2);
    const encoded = await encodeFitted(buffer, maxDimension, quality);

    if (encoded.buffer.byteLength <= IMAGE_UPLOAD_MAX_BYTES) {
      best = encoded;
      low = quality + 1;
    } else {
      high = quality - 1;
    }
  }

  return best;
}

async function encodeWithinMaxBytes(buffer) {
  let maxDimension = IMAGE_UPLOAD_MAX_DIMENSION;

  while (maxDimension >= MIN_DIMENSION) {
    const encoded = await findBestQuality(buffer, maxDimension);

    if (encoded) {
      return encoded;
    }

    maxDimension -= DIMENSION_STEP;
  }

  return encodeFitted(buffer, MIN_DIMENSION, IMAGE_UPLOAD_MIN_QUALITY);
}

export async function prepareStoredImage(buffer) {
  return encodeWithinMaxBytes(buffer);
}
