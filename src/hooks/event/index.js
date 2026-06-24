"use client";

import { getResource } from "@/lib/hooks/resources";

const { client, hooks } = getResource("event");

export const fetchEvents = client.fetchList;
export const fetchEvent = client.fetchOne;
export const createEvent = client.create;
export const updateEvent = client.update;
export const deleteEvent = client.remove;

export const useEvents = hooks.useList;
export const useEvent = hooks.useItem;
export const useCreateEvent = hooks.useCreate;
export const useUpdateEvent = hooks.useUpdate;
export const useDeleteEvent = hooks.useDelete;
