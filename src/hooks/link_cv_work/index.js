"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("link_cv_work");

export const fetchLinkCvWorks = client.fetchList;
export const fetchLinkCvWork = client.fetchOne;
export const createLinkCvWork = client.create;
export const updateLinkCvWork = client.update;
export const deleteLinkCvWork = client.remove;

export const useLinkCvWorks = hooks.useList;
export const useLinkCvWork = hooks.useItem;
export const useCreateLinkCvWork = hooks.useCreate;
export const useUpdateLinkCvWork = hooks.useUpdate;
export const useDeleteLinkCvWork = hooks.useDelete;
