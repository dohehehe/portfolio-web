"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("link_event_work");

export const fetchLinkEventWorks = client.fetchList;
export const fetchLinkEventWork = client.fetchOne;
export const createLinkEventWork = client.create;
export const updateLinkEventWork = client.update;
export const deleteLinkEventWork = client.remove;

export const useLinkEventWorks = hooks.useList;
export const useLinkEventWork = hooks.useItem;
export const useCreateLinkEventWork = hooks.useCreate;
export const useUpdateLinkEventWork = hooks.useUpdate;
export const useDeleteLinkEventWork = hooks.useDelete;
