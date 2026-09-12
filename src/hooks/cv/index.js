"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("cv");

export const fetchCvs = client.fetchList;
export const fetchCv = client.fetchOne;
export const createCv = client.create;
export const updateCv = client.update;
export const deleteCv = client.remove;

export const useCvs = hooks.useList;
export const useCv = hooks.useItem;
export const useCreateCv = hooks.useCreate;
export const useUpdateCv = hooks.useUpdate;
export const useDeleteCv = hooks.useDelete;
