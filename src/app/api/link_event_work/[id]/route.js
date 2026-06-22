import { createItemHandlers } from "@/lib/api/crud";

export const { GET, PATCH, DELETE } = createItemHandlers("link_event_work");
