"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("cv_type");

export const fetchCvTypes = client.fetchList;
export const fetchCvType = client.fetchOne;
export const createCvType = client.create;
export const updateCvType = client.update;
export const deleteCvType = client.remove;

export const useCvTypes = hooks.useList;
export const useCvType = hooks.useItem;
export const useCreateCvType = hooks.useCreate;
export const useUpdateCvType = hooks.useUpdate;
export const useDeleteCvType = hooks.useDelete;
