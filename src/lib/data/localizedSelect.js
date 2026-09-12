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
    space_ko,
    space_en,
    link_url,
    exhibition_id,
    type_id,
    cv_type:type_id (
      id,
      name_ko,
      name_en
    ),
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

export const TEXT_DETAIL_KO_COLUMNS =
  "id,created_at,year,title_ko,title_en,writer_ko,writer_en,content_ko,project_id,event_id,work_id";

export const TEXT_DETAIL_EN_COLUMNS =
  "id,created_at,year,title_ko,title_en,writer_ko,writer_en,content_en,project_id,event_id,work_id";

export function getTextDetailColumns(locale) {
  return locale === "en" ? TEXT_DETAIL_EN_COLUMNS : TEXT_DETAIL_KO_COLUMNS;
}

export const EVENT_RELATED_COLUMNS =
  "id,title_ko,title_en,date,space_ko,space_en";

export const EVENT_DETAIL_KO_COLUMNS =
  "id,title_ko,title_en,date,space_ko,space_en,content_ko,credit_ko,gallery,file_link,note_kr";

export const EVENT_DETAIL_EN_COLUMNS =
  "id,title_ko,title_en,date,space_ko,space_en,content_en,credit_en,gallery,file_link,note_en";

export function getEventDetailColumns(locale) {
  return locale === "en" ? EVENT_DETAIL_EN_COLUMNS : EVENT_DETAIL_KO_COLUMNS;
}

export function getProjectRelatedColumns(locale) {
  return locale === "en"
    ? "id,year,title_ko,title_en,medium_en,dimension_en"
    : "id,year,title_ko,title_en,medium_ko,dimension_ko";
}

export function getWorkRelatedColumns(locale) {
  return locale === "en"
    ? "id,year,project_id,title_ko,title_en,medium_en,dimension_en"
    : "id,year,project_id,title_ko,title_en,medium_ko,dimension_ko";
}

export function serializeWorkIds(workIds) {
  return [...workIds].sort().join(",");
}
