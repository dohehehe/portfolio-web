export const PROJECT_KO_COLUMNS =
  "id,created_at,year,title_ko,medium_ko,dimension_ko,content_ko,credit_ko,gallery";

export const PROJECT_EN_COLUMNS =
  "id,created_at,year,title_en,medium_en,dimension_en,content_en,credit_en,gallery";

export const WORK_KO_COLUMNS =
  "id,created_at,year,project_id,title_ko,medium_ko,dimension_ko,content_ko,credit_ko,gallery";

export const WORK_EN_COLUMNS =
  "id,created_at,year,project_id,title_en,medium_en,dimension_en,content_en,credit_en,gallery";

export function getProjectColumns(locale) {
  return locale === "en" ? PROJECT_EN_COLUMNS : PROJECT_KO_COLUMNS;
}

export function getWorkColumns(locale) {
  return locale === "en" ? WORK_EN_COLUMNS : WORK_KO_COLUMNS;
}
