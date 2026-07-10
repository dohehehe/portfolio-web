"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("link_cv_item");

export const fetchLinkCvItems = client.fetchList;
export const fetchLinkCvItem = client.fetchOne;
export const createLinkCvItem = client.create;
export const updateLinkCvItem = client.update;
export const deleteLinkCvItem = client.remove;

export const useLinkCvItems = hooks.useList;
export const useLinkCvItem = hooks.useItem;
export const useCreateLinkCvItem = hooks.useCreate;
export const useUpdateLinkCvItem = hooks.useUpdate;
export const useDeleteLinkCvItem = hooks.useDelete;
