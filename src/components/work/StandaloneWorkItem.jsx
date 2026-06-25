"use client";

import WorkItemDetail from "./WorkItemDetail";
import { useLocalizedItem } from "./useLocalizedPage";

export default function StandaloneWorkItem({ item }) {
  const { item: localizedItem } = useLocalizedItem("work", item);

  return <WorkItemDetail item={localizedItem} />;
}
