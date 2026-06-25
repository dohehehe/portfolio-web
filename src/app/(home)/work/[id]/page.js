import { notFound } from "next/navigation";
import ProjectWorkPage from "@/components/work/ProjectWorkPage";
import StandaloneWorkItem from "@/components/work/StandaloneWorkItem";
import { getWorkRouteById } from "@/lib/data/workRoute";

function getRouteTitle(route) {
  if (route.type === "standalone") {
    return route.item.title_ko || route.item.title_en || "Work";
  }

  if (route.scrollToId) {
    const work = route.works.find((item) => item.id === route.scrollToId);
    return work?.title_ko || work?.title_en || route.project.title_ko || "Work";
  }

  return route.project.title_ko || route.project.title_en || "Work";
}

function getRouteDescription(route) {
  if (route.type === "standalone") {
    return route.item.medium_ko || route.item.medium_en || undefined;
  }

  return route.project.medium_ko || route.project.medium_en || undefined;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const route = await getWorkRouteById(id);

  if (!route) {
    return { title: "Not found" };
  }

  return {
    title: getRouteTitle(route),
    description: getRouteDescription(route),
  };
}

export default async function WorkPage({ params }) {
  const { id } = await params;
  const route = await getWorkRouteById(id);

  if (!route) {
    notFound();
  }

  if (route.type === "standalone") {
    return <StandaloneWorkItem item={route.item} />;
  }

  return (
    <ProjectWorkPage
      project={route.project}
      works={route.works}
      scrollToId={route.scrollToId}
    />
  );
}
