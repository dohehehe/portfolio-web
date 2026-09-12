"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("text");

export const fetchTexts = client.fetchList;
export const fetchText = client.fetchOne;
export const createText = client.create;
export const updateText = client.update;
export const deleteText = client.remove;

export const useTexts = hooks.useList;
export const useText = hooks.useItem;
export const useCreateText = hooks.useCreate;
export const useUpdateText = hooks.useUpdate;
export const useDeleteText = hooks.useDelete;
