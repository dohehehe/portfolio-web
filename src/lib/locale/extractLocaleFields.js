const EN_FIELD_KEYS = [
  "title_en",
  "medium_en",
  "dimension_en",
  "content_en",
  "credit_en",
];

export function extractEnFields(record) {
  if (!record) {
    return null;
  }

  const fields = { id: record.id };

  for (const key of EN_FIELD_KEYS) {
    if (record[key] != null) {
      fields[key] = record[key];
    }
  }

  return fields;
}
