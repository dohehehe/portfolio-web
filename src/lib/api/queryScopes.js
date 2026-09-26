/** Column sets for admin API `?scope=` queries. */

export const QUERY_SCOPE = {
  list: "list",
  options: "options",
  detail: "detail",
};

const ADMIN_LIST_COLUMNS = {
  cv: "id,year,title_ko,space_ko,link_url,type_id,is_active",
  cv_type: "id,name_ko,name_en",
  event: "id,date,title_ko,space_ko,link_url,is_active",
  info: "id,email,bio_ko",
  link_cv_item: "id,cv_id,project_id,work_id",
  live: "id,start_at,end_at,title_ko,space_ko,link_url,is_active",
  project: "id,year,title_ko,title_en,medium_ko,is_active",
  text: "id,year,title_ko,writer_ko,type_id,is_active",
  text_type: "id,name,slug",
  work: 'id,year,project_id,title_ko,title_en,medium_ko,"order",is_active',
};

const ADMIN_OPTIONS_COLUMNS = {
  cv: "id,title_ko,title_en,year",
  cv_type: "id,name_ko,name_en",
  event: "id,title_ko,title_en,date",
  info: "id,email",
  link_cv_item: "id,cv_id,project_id,work_id",
  live: "id,title_ko,title_en,start_at",
  project: "id,title_ko,title_en,year",
  text: "id,title_ko,title_en,year,type_id",
  text_type: "id,name,slug",
  work: "id,title_ko,title_en,year,project_id",
};

export function parseQueryScope(value) {
  if (value === QUERY_SCOPE.options) {
    return QUERY_SCOPE.options;
  }

  if (value === QUERY_SCOPE.detail) {
    return QUERY_SCOPE.detail;
  }

  return QUERY_SCOPE.list;
}

export function getSelectColumns(table, scope = QUERY_SCOPE.list) {
  if (scope === QUERY_SCOPE.detail) {
    return "*";
  }

  if (scope === QUERY_SCOPE.options) {
    return ADMIN_OPTIONS_COLUMNS[table] ?? ADMIN_LIST_COLUMNS[table] ?? "*";
  }

  return ADMIN_LIST_COLUMNS[table] ?? "*";
}
