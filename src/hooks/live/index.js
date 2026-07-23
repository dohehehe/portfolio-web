"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("live");

export const fetchLives = client.fetchList;
export const fetchLive = client.fetchOne;
export const createLive = client.create;
export const updateLive = client.update;
export const deleteLive = client.remove;

export const useLives = hooks.useList;
export const useLive = hooks.useItem;
export const useCreateLive = hooks.useCreate;
export const useUpdateLive = hooks.useUpdate;
export const useDeleteLive = hooks.useDelete;
