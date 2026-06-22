function getApiBase(table) {
  return `/api/${table}`;
}

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
}

export function createCrudClient(table) {
  const apiBase = getApiBase(table);

  return {
    fetchList() {
      return parseResponse(fetch(apiBase));
    },

    fetchOne(id) {
      return parseResponse(fetch(`${apiBase}/${id}`));
    },

    create(payload) {
      return parseResponse(
        fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    },

    update(id, payload) {
      return parseResponse(
        fetch(`${apiBase}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    },

    remove(id) {
      return parseResponse(
        fetch(`${apiBase}/${id}`, {
          method: "DELETE",
        }),
      );
    },
  };
}
