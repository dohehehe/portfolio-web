import { normalizeGallery } from "@/components/admin/forms/formUtils";
import HomeImageFrame from "@/components/home/homeImageFrame";
import { getProjectsForHomeGallery } from "@/lib/data/project";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { localizedPath } from "@/lib/locale/routing";

export default async function HomeImage({ locale }) {
  const projects = await getProjectsForHomeGallery();
  const slides = projects.flatMap((project) =>
    normalizeGallery(project.gallery)
      .filter((item) => item.img_url)
      .map((item, index) => ({
        key: `${project.id}-${index}`,
        href: localizedPath(`/work/${project.id}`, locale),
        src: item.img_url,
        alt: pickLocalized(project, "title", locale) || "",
      })),
  );

  if (slides.length === 0) {
    return null;
  }

  return <HomeImageFrame slides={slides} />;
}
