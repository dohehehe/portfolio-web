"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("work");

export const fetchWorks = client.fetchList;
export const fetchWork = client.fetchOne;
export const createWork = client.create;
export const updateWork = client.update;
export const deleteWork = client.remove;

export const useWorks = hooks.useList;
export const useWork = hooks.useItem;
export const useCreateWork = hooks.useCreate;
export const useUpdateWork = hooks.useUpdate;
export const useDeleteWork = hooks.useDelete;
