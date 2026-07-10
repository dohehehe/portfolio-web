"use client";

import { getResource } from "@/lib/hooks/resources";

export function useResourceList(table, options) {
  const resource = getResource(table);

  if (!resource) {
    throw new Error(`Unknown resource table: ${table}`);
  }

  return resource.hooks.useList(options);
}

export function useResourceItem(table, id, options) {
  const resource = getResource(table);

  if (!resource) {
    throw new Error(`Unknown resource table: ${table}`);
  }

  return resource.hooks.useItem(id, options);
}

export function useCreateResource(table) {
  const resource = getResource(table);

  if (!resource) {
    throw new Error(`Unknown resource table: ${table}`);
  }

  return resource.hooks.useCreate();
}

export function useUpdateResource(table) {
  const resource = getResource(table);

  if (!resource) {
    throw new Error(`Unknown resource table: ${table}`);
  }

  return resource.hooks.useUpdate();
}

export function useDeleteResource(table) {
  const resource = getResource(table);

  if (!resource) {
    throw new Error(`Unknown resource table: ${table}`);
  }

  return resource.hooks.useDelete();
}

export function getResourceClient(table) {
  const resource = getResource(table);

  if (!resource) {
    throw new Error(`Unknown resource table: ${table}`);
  }

  return resource.client;
}
