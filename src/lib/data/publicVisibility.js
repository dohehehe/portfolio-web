/** Rows with is_active=false are hidden on the public site; null/true stay visible. */
export function applyPublicActiveFilter(query) {
  return query.or("is_active.is.null,is_active.eq.true");
}

export function isPubliclyVisible(record) {
  return record?.is_active !== false;
}
