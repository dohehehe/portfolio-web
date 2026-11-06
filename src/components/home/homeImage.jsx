import HomeImageList from "@/components/home/homeImageList";
import { getHomeGallerySlides } from "@/lib/data/gallery";

export default async function HomeImage({ locale }) {
  const slides = await getHomeGallerySlides(locale);

  if (slides.length === 0) {
    return null;
  }

  return (
    <HomeImageList slides={slides} />
  );
}
