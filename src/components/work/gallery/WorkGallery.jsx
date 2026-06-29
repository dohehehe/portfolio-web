import GallerySwiper from "./GallerySwiper";

export default function WorkGallery({ items, variant = "work" }) {
  return <GallerySwiper items={items} variant={variant} />;
}
