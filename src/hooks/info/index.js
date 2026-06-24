"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("info");

export const fetchInfos = client.fetchList;
export const fetchInfo = client.fetchOne;
export const createInfo = client.create;
export const updateInfo = client.update;
export const deleteInfo = client.remove;

export const useInfos = hooks.useList;
export const useInfo = hooks.useItem;
export const useCreateInfo = hooks.useCreate;
export const useUpdateInfo = hooks.useUpdate;
export const useDeleteInfo = hooks.useDelete;
