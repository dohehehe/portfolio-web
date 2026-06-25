"use client";

import { useCallback } from "react";
import { IMAGE_UPLOAD_MAX_SIZE_MB } from "@/lib/imageUpload/constants";
import { compressImageForUpload } from "@/utils/imageCompression";

async function parseUploadResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return {
    error: text || `Upload failed with status ${response.status}.`,
  };
}

export function useImageUpload({
  maxSizeInMB = IMAGE_UPLOAD_MAX_SIZE_MB,
  endpoint = "/api/upload",
} = {}) {
  const uploadImageToServer = useCallback(
    async (file) => {
      try {
        const compressedFile = await compressImageForUpload(file, {
          maxSizeInMB,
        });
        const formData = new FormData();
        formData.append("file", compressedFile);

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const data = await parseUploadResponse(response);

        if (!response.ok) {
          return {
            success: false,
            error: data.error ?? "Image upload failed.",
          };
        }

        return {
          success: true,
          file: { url: data.url },
        };
      } catch (error) {
        return {
          success: false,
          error: error.message ?? "Image upload failed.",
        };
      }
    },
    [endpoint, maxSizeInMB],
  );

  return { uploadImageToServer };
}
