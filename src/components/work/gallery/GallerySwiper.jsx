"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./GallerySwiper.module.css";

function ArrowIcon({ direction }) {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GallerySwiper({ items, variant = "work" }) {
  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!items?.length) {
    return null;
  }

  const hasMultipleSlides = items.length > 1;
  const variantClass =
    variant === "project" ? styles.projectGallery : styles.workGallery;

  function updateNavState(instance) {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  }

  return (
    <div
      className={`${styles.gallery} ${variantClass} ${hasMultipleSlides ? "" : styles.single
        }`.trim()}
    >
      <div className={styles.swiperWrap}>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navPrev}`}
          aria-label="Previous image"
          disabled={!hasMultipleSlides || isBeginning}
          onClick={() => swiper?.slidePrev()}
        >
          <ArrowIcon direction="prev" />
        </button>

        <Swiper
          className={styles.swiper}
          slidesPerView={1}
          spaceBetween={10}
          speed={520}
          grabCursor={hasMultipleSlides}
          watchOverflow
          onSwiper={(instance) => {
            setSwiper(instance);
            updateNavState(instance);
          }}
          onSlideChange={updateNavState}
        >
          {items.map((item, index) => (
            <SwiperSlide key={`${item.img_url}-${index}`} style={{ width: 'auto' }}>
              <figure className={styles.slide}>
                <div className={styles.imageWrap}>
                  <img
                    className={styles.image}
                    src={item.img_url}
                    alt={item.caption || ""}
                  />
                </div>
                {item.caption ? (
                  <figcaption className={styles.caption}>
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className={`${styles.navButton} ${styles.navNext}`}
          aria-label="Next image"
          disabled={!hasMultipleSlides || isEnd}
          onClick={() => swiper?.slideNext()}
        >
          <ArrowIcon direction="next" />
        </button>
      </div>
    </div>
  );
}
