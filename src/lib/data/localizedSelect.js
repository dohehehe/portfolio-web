export const PROJECT_KO_COLUMNS =
  "id,created_at,year,title_ko,title_en,medium_ko,dimension_ko,content_ko,credit_ko,gallery";

export const PROJECT_EN_COLUMNS =
  "id,created_at,year,title_ko,title_en,medium_en,dimension_en,content_en,credit_en,gallery";

export const WORK_KO_COLUMNS =
  'id,created_at,year,project_id,title_ko,title_en,medium_ko,dimension_ko,content_ko,credit_ko,gallery,"order"';

export const WORK_EN_COLUMNS =
  'id,created_at,year,project_id,title_ko,title_en,medium_en,dimension_en,content_en,credit_en,gallery,"order"';

export function getProjectColumns(locale) {
  return locale === "en" ? PROJECT_EN_COLUMNS : PROJECT_KO_COLUMNS;
}

export function getWorkColumns(locale) {
  return locale === "en" ? WORK_EN_COLUMNS : WORK_KO_COLUMNS;
}

export const CV_LINK_SELECT = `
  cv (
    id,
    created_at,
    year,
    title_ko,
    title_en,
    event_title_ko,
    event_title_en,
    exhibition_id,
    event:exhibition_id (
      id,
      title_ko,
      title_en,
      date,
      space_ko,
      space_en
    )
  )
`;

export const EVENT_WORK_LINK_SELECT = `
  project_id,
  work_id,
  cv!inner (
    exhibition_id
  ),
  project:project_id (
    id,
    created_at,
    year,
    title_ko,
    title_en,
    medium_ko,
    medium_en,
    dimension_ko,
    dimension_en
  ),
  work:work_id (
    id,
    created_at,
    year,
    project_id,
    title_ko,
    title_en,
    medium_ko,
    medium_en,
    dimension_ko,
    dimension_en
  )
`;

export const TEXT_COLUMNS =
  "id,created_at,year,title_ko,title_en,writer_ko,writer_en";

export const TEXT_DETAIL_COLUMNS =
  "id,created_at,year,title_ko,title_en,writer_ko,writer_en,content_ko,content_en,project_id,event_id,work_id";
