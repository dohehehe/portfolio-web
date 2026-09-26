"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useCreateResource,
  useDeleteResource,
  useResourceItem,
  useResourceList,
  useUpdateResource,
} from "@/hooks/useResource";
import CvItemMultiSelect from "./CvItemMultiSelect";
import ForeignSelect from "./ForeignSelect";
import {
  getCvLinkSelections,
  syncLinkCvItems,
  toggleSelectedId,
} from "./linkCvItemUtils";
import styles from "../AdminForm.module.css";

export default function CvEditForm({ id }) {
  const router = useRouter();

  const [titleKo, setTitleKo] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [spaceKo, setSpaceKo] = useState("");
  const [spaceEn, setSpaceEn] = useState("");
  const [year, setYear] = useState("");
  const [typeId, setTypeId] = useState("");
  const [exhibitionId, setExhibitionId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedWorkIds, setSelectedWorkIds] = useState([]);
  const [linksInitialized, setLinksInitialized] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data: cvItem, loading, error } = useResourceItem("cv", id);
  const { data: cvLinks = [], loading: linksLoading } = useResourceList(
    "link_cv_item",
    {
      enabled: Boolean(id),
      filters: { cv_id: id },
    },
  );
  const { data: projects = [], loading: projectsLoading } = useResourceList(
    "project",
    { scope: "options" },
  );
  const { data: works = [], loading: worksLoading } = useResourceList("work", {
    scope: "options",
  });
  const { update, loading: updating } = useUpdateResource("cv");
  const { remove, loading: deleting } = useDeleteResource("cv");
  const { create: createLink } = useCreateResource("link_cv_item");
  const { remove: deleteLink } = useDeleteResource("link_cv_item");

  const itemsLoading = projectsLoading || worksLoading || linksLoading;

  useEffect(() => {
    if (!cvItem) {
      return;
    }

    setTitleKo(cvItem.title_ko ?? "");
    setTitleEn(cvItem.title_en ?? "");
    setSpaceKo(cvItem.space_ko ?? "");
    setSpaceEn(cvItem.space_en ?? "");
    setYear(cvItem.year ?? "");
    setTypeId(cvItem.type_id ?? "");
    setExhibitionId(cvItem.exhibition_id ?? "");
    setLinkUrl(cvItem.link_url ?? "");
  }, [cvItem]);

  useEffect(() => {
    if (linksLoading) {
      return;
    }

    const { projectIds, workIds } = getCvLinkSelections(cvLinks, id);
    setSelectedProjectIds(projectIds);
    setSelectedWorkIds(workIds);
    setLinksInitialized(true);
  }, [cvLinks, id, linksLoading]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    try {
      await update(id, {
        title_ko: titleKo.trim() || null,
        title_en: titleEn.trim() || null,
        space_ko: spaceKo.trim() || null,
        space_en: spaceEn.trim() || null,
        year: year.trim() || null,
        type_id: typeId || null,
        exhibition_id: exhibitionId || null,
        link_url: linkUrl.trim() || null,
      });

      await syncLinkCvItems({
        cvId: id,
        projectIds: selectedProjectIds,
        workIds: selectedWorkIds,
        existingLinks: cvLinks,
        createLink,
        deleteLink,
      });

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "CV 수정에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 cv 항목을 삭제할까요?")) {
      return;
    }

    setSubmitError(null);

    try {
      for (const link of cvLinks) {
        await deleteLink(link.id);
      }

      await remove(id);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setSubmitError(err.message ?? "CV 삭제에 실패했습니다.");
    }
  }

  if (loading || !linksInitialized) {
    return <p className={styles.status}>불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error.message}</p>;
  }

  if (!cvItem) {
    return <p className={styles.error}>CV를 찾을 수 없습니다.</p>;
  }

  const saving = updating || deleting;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>CV 수정</h1>
          <p className={styles.description}>cv 테이블</p>
        </div>
        <Link className={styles.backLink} href="/admin">
          목록으로
        </Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          title_ko
          <input
            className={styles.input}
            type="text"
            value={titleKo}
            onChange={(event) => setTitleKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          title_en
          <input
            className={styles.input}
            type="text"
            value={titleEn}
            onChange={(event) => setTitleEn(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          space_ko
          <input
            className={styles.input}
            type="text"
            value={spaceKo}
            onChange={(event) => setSpaceKo(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          space_en
          <input
            className={styles.input}
            type="text"
            value={spaceEn}
            onChange={(event) => setSpaceEn(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          year
          <input
            className={styles.input}
            type="text"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </label>

        <label className={styles.label}>
          type_id
          <ForeignSelect
            foreignTable="cv_type"
            labelKey="name_ko"
            value={typeId}
            onChange={setTypeId}
          />
        </label>

        <label className={styles.label}>
          exhibition_id
          <ForeignSelect
            foreignTable="event"
            labelKey="title_ko"
            value={exhibitionId}
            onChange={setExhibitionId}
          />
        </label>

        <label className={styles.label}>
          link_url
          <input
            className={styles.input}
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://"
          />
        </label>

        <CvItemMultiSelect
          projects={projects}
          works={works}
          selectedProjectIds={selectedProjectIds}
          selectedWorkIds={selectedWorkIds}
          onToggleProject={(projectId) =>
            setSelectedProjectIds((current) =>
              toggleSelectedId(current, projectId),
            )
          }
          onToggleWork={(workId) =>
            setSelectedWorkIds((current) => toggleSelectedId(current, workId))
          }
          disabled={saving}
          loading={itemsLoading}
        />

        {submitError ? <p className={styles.error}>{submitError}</p> : null}

        <div className={styles.formActions}>
          <button className={styles.submitButton} type="submit" disabled={saving}>
            {updating ? "저장 중..." : "수정 저장"}
          </button>

          <button
            className={styles.deleteButton}
            type="button"
            disabled={saving}
            onClick={handleDelete}
          >
            {deleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </form>
    </div>
  );
}
