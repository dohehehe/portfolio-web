import { notFound } from "next/navigation";
import ProjectWorkPage from "@/components/work/project/ProjectWorkPage";
import WorkItemDetail from "@/components/work/work/WorkItemDetail";
import JsonLd from "@/components/seo/JsonLd";
import { getWorkRouteById } from "@/lib/data/workRoute";
import {
  buildDetailPageMetadata,
  getLocalizedMetadata,
  getWorkMetadataSource,
} from "@/lib/locale/metadata";
import { buildVisualArtworkJsonLd } from "@/lib/structured-data/buildJsonLd";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const route = await getWorkRouteById(id, locale);

  if (!route) {
    return { title: "Not found" };
  }

  return buildDetailPageMetadata(
    `/work/${id}`,
    locale,
    getLocalizedMetadata(route, locale),
  );
}

export default async function WorkPage({ params }) {
  const { locale, id } = await params;
  const route = await getWorkRouteById(id, locale);

  if (!route) {
    notFound();
  }

  if (route.type === "standalone") {
    return (
      <>
        <JsonLd
          data={buildVisualArtworkJsonLd({
            item: route.item,
            locale,
            pathname: `/work/${id}`,
          })}
        />
        <WorkItemDetail
          item={route.item}
          cvs={route.cvs}
          texts={route.texts}
          locale={locale}
        />
      </>
    );
  }

  const source = getWorkMetadataSource(route);

  return (
    <>
      <JsonLd
        data={buildVisualArtworkJsonLd({
          item: source,
          locale,
          pathname: `/work/${id}`,
        })}
      />
      <ProjectWorkPage
      project={route.project}
      works={route.works}
      cvs={route.cvs}
      texts={route.texts}
      scrollToId={route.scrollToId}
      locale={locale}
    />
    </>
  );
}
