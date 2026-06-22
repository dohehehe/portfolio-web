"use client";

import { useRouter } from "next/navigation";
import { tableNames } from "@/lib/supabase/generated/database.schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard({ user }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
        <button
          className={styles.logoutButton}
          type="button"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      <p className={styles.content}>
        포트폴리오 콘텐츠를 관리할 수 있는 관리자 페이지입니다.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>데이터 테이블</h2>
        <ul className={styles.tableList}>
          {tableNames.map((name) => (
            <li key={name} className={styles.tableItem}>
              {name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
