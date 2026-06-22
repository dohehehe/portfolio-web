"use client";

import { useRouter } from "next/navigation";
import AdminDataTables from "@/components/admin/AdminDataTables";
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
          {user?.email ? <p className={styles.email}>{user.email}</p> : null}
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

      <AdminDataTables />
    </div>
  );
}
