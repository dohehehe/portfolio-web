"use client";

import { forwardRef, useEffect, useState } from "react";
import EditorInput from "./EditorInput";
import styles from "./EditorInput.module.css";

const EditorInputClient = forwardRef(function EditorInputClient(props, ref) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>에디터를 로딩 중...</div>
      </div>
    );
  }

  return <EditorInput ref={ref} {...props} />;
});

EditorInputClient.displayName = "EditorInputClient";

export default EditorInputClient;
