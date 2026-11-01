import HomeImageFrame from "@/components/home/homeImageFrame";
import { getHomeGallerySlides } from "@/lib/data/gallery";

export default async function HomeImage({ locale }) {
  const slides = await getHomeGallerySlides(locale);

  if (slides.length === 0) {
    return null;
  }

  return <HomeImageFrame slides={slides} />;
}
