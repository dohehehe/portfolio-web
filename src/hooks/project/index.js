"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("project");

export const fetchProjects = client.fetchList;
export const fetchProject = client.fetchOne;
export const createProject = client.create;
export const updateProject = client.update;
export const deleteProject = client.remove;

export const useProjects = hooks.useList;
export const useProject = hooks.useItem;
export const useCreateProject = hooks.useCreate;
export const useUpdateProject = hooks.useUpdate;
export const useDeleteProject = hooks.useDelete;
