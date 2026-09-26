"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("text_type");

export const fetchTextTypes = client.fetchList;
export const fetchTextType = client.fetchOne;
export const createTextType = client.create;
export const updateTextType = client.update;
export const deleteTextType = client.remove;

export const useTextTypes = hooks.useList;
export const useTextType = hooks.useItem;
export const useCreateTextType = hooks.useCreate;
export const useUpdateTextType = hooks.useUpdate;
export const useDeleteTextType = hooks.useDelete;
