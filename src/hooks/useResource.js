"use client";

import { getResource } from "@/lib/hooks/resources";

function resolveResource(table) {
  const resource = getResource(table);

  if (!resource) {
    throw new Error(`Unknown resource table: ${table}`);
  }

  return resource;
}

export function useResourceList(table, options) {
  return resolveResource(table).hooks.useList(options);
}

export function useResourceItem(table, id, options) {
  return resolveResource(table).hooks.useItem(id, options);
}

export function useCreateResource(table) {
  return resolveResource(table).hooks.useCreate();
}

export function useUpdateResource(table) {
  return resolveResource(table).hooks.useUpdate();
}

export function useDeleteResource(table) {
  return resolveResource(table).hooks.useDelete();
}

export function getResourceClient(table) {
  return resolveResource(table).client;
}

export function fetchResourceList(table, options) {
  return getResourceClient(table).fetchList(options);
}

export function fetchResourceOptions(table) {
  return getResourceClient(table).fetchOptions();
}

export function fetchResourceItem(table, id, options) {
  return getResourceClient(table).fetchOne(id, options);
}

export function createResource(table, payload) {
  return getResourceClient(table).create(payload);
}

export function updateResource(table, id, payload) {
  return getResourceClient(table).update(id, payload);
}

export function deleteResource(table, id) {
  return getResourceClient(table).remove(id);
}
