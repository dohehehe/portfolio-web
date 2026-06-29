import { notFound } from "next/navigation";
import ProjectWorkPage from "@/components/work/project/ProjectWorkPage";
import WorkItemDetail from "@/components/work/work/WorkItemDetail";
import { getWorkRouteById } from "@/lib/data/workRoute";
import {
  buildLanguageAlternates,
  getLocalizedMetadata,
} from "@/lib/locale/metadata";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const route = await getWorkRouteById(id, locale);

  if (!route) {
    return { title: "Not found" };
  }

  const { title, description } = getLocalizedMetadata(route, locale);

  return {
    title,
    description,
    alternates: {
      languages: buildLanguageAlternates(`/work/${id}`),
    },
  };
}

export default async function WorkPage({ params }) {
  const { locale, id } = await params;
  const route = await getWorkRouteById(id, locale);

  if (!route) {
    notFound();
  }

  if (route.type === "standalone") {
    return <WorkItemDetail item={route.item} locale={locale} />;
  }

  return (
    <ProjectWorkPage
      project={route.project}
      works={route.works}
      cvs={route.cvs}
      texts={route.texts}
      scrollToId={route.scrollToId}
      locale={locale}
    />
  );
}
