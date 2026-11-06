import HomeImageLink from "@/components/home/homeImageLink";
import { getHomeGallerySlides } from "@/lib/data/gallery";
import styles from "./homeImage.module.css";

export default async function HomeImage({ locale }) {
  const slides = await getHomeGallerySlides(locale);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={styles.imageContainer}>
      {slides.map((slide) => (
        <HomeImageLink key={slide.key} slide={slide} />
      ))}
    </div>
  );
}
