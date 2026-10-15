"use client";

import { useCallback } from "react";
import { IMAGE_UPLOAD_TYPES } from "@/lib/imageUpload/constants";

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

export function useImageUpload({ endpoint = "/api/upload" } = {}) {
  const uploadImageToServer = useCallback(
    async (file) => {
      try {
        if (!file?.type || !IMAGE_UPLOAD_TYPES[file.type]) {
          return {
            success: false,
            error: "JPEG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다.",
          };
        }

        const formData = new FormData();
        formData.append("file", file);

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
          file: {
            url: data.url,
            width: data.width ?? null,
            height: data.height ?? null,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error.message ?? "Image upload failed.",
        };
      }
    },
    [endpoint]
  );

  const deleteImageFromServer = useCallback(
    async (url) => {
      try {
        const response = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        const data = await parseUploadResponse(response);

        if (!response.ok) {
          return {
            success: false,
            error: data.error ?? "Image delete failed.",
          };
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.message ?? "Image delete failed.",
        };
      }
    },
    [endpoint]
  );

  return { uploadImageToServer, deleteImageFromServer };
}
