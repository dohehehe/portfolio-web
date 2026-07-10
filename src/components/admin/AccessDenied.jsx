"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "./LoginForm.module.css";

export default function AccessDenied() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>접근 불가</h1>
      <p className={styles.subtitle}>관리자 권한이 없는 계정입니다.</p>
      <p className={styles.error}>
        이 계정으로는 admin 페이지에 접근할 수 없습니다.
      </p>
      <button
        className={styles.button}
        type="button"
        onClick={handleSignOut}
        style={{ marginTop: 16 }}
      >
        다른 계정으로 로그인
      </button>
    </div>
  );
}
