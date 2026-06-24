import { createItemHandlers } from "@/lib/api/crud";

export const { GET, PATCH, DELETE } = createItemHandlers("cv_type");
