"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ImageLightbox from "./ImageLightbox";

const ImageLightboxContext = createContext(null);

function normalizeItem(item) {
  return {
    src: item.src ?? item.img_url ?? "",
    alt: item.alt ?? item.caption ?? "",
    caption: item.caption ?? "",
  };
}

function normalizeItems(items) {
  return items.map(normalizeItem).filter((item) => item.src);
}

const INITIAL_STATE = {
  isOpen: false,
  items: [],
  index: 0,
};

export function ImageLightboxProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const open = useCallback((options) => {
    if (options?.src || options?.img_url) {
      const item = normalizeItem(options);

      if (!item.src) {
        return;
      }

      setState({
        isOpen: true,
        items: [item],
        index: 0,
      });
      return;
    }

    const items = normalizeItems(options?.items ?? []);

    if (!items.length) {
      return;
    }

    const index = Math.min(
      Math.max(options?.index ?? 0, 0),
      items.length - 1,
    );

    setState({
      isOpen: true,
      items,
      index,
    });
  }, []);

  const goPrev = useCallback(() => {
    setState((prev) => ({
      ...prev,
      index: Math.max(prev.index - 1, 0),
    }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      index: Math.min(prev.index + 1, prev.items.length - 1),
    }));
  }, []);

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen: state.isOpen,
    }),
    [open, close, state.isOpen],
  );

  return (
    <ImageLightboxContext.Provider value={value}>
      {children}
      <ImageLightbox
        isOpen={state.isOpen}
        items={state.items}
        index={state.index}
        onClose={close}
        onPrev={goPrev}
        onNext={goNext}
      />
    </ImageLightboxContext.Provider>
  );
}

export function useImageLightbox() {
  const context = useContext(ImageLightboxContext);

  if (!context) {
    throw new Error("useImageLightbox must be used within ImageLightboxProvider");
  }

  return context;
}
