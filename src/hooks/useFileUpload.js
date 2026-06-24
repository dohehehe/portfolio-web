"use client";

import { useCallback } from "react";

export function useFileUpload({ endpoint = "/api/upload/file" } = {}) {
  const uploadFileToServer = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error ?? "File upload failed.",
          };
        }

        return {
          success: true,
          file: { url: data.url },
        };
      } catch (error) {
        return {
          success: false,
          error: error.message ?? "File upload failed.",
        };
      }
    },
    [endpoint],
  );

  return { uploadFileToServer };
}
