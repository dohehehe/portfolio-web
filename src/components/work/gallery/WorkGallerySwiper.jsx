"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/mousewheel";
import styles from "./WorkGallerySwiper.module.css";


export default function WorkGallerySwiper({ items }) {

  if (!items?.length) {
    return null;
  }

  return (
    <Swiper
      className={styles.swiper}
      modules={Navigation}
      navigation={true}
      slidesPerView={'auto'}
      speed={520}
      allowTouchMove={true}
    >
      {items.map((item, index) => (
        <SwiperSlide key={`${item.img_url}-${index}`} className={styles["swiper-slide"]}>
          <figure className={styles.slide}>
            <img
              className={styles.image}
              src={item.img_url}
              alt={item.caption || ""}
            />
            {item.caption ? (
              <figcaption className={styles.caption}>
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        </SwiperSlide>
      ))}
    </Swiper>

  );
}
