import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

export default function ImageGallery({ images = [] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-6xl">
        👟
      </div>
    );
  }

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <Swiper
        modules={[Navigation, Thumbs, Zoom]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        navigation
        zoom
        spaceBetween={0}
        slidesPerView={1}
        className="rounded-2xl overflow-hidden bg-gray-50 aspect-square product-main-swiper"
      >
        {sorted.map((img) => (
          <SwiperSlide key={img.id}>
            <div className="swiper-zoom-container">
              <img
                src={img.imageUrl}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={Math.min(sorted.length, 5)}
          watchSlidesProgress
          className="product-thumbs-swiper"
        >
          {sorted.map((img) => (
            <SwiperSlide key={img.id}>
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-transparent cursor-pointer hover:border-primary/50 transition-all">
                <img
                  src={img.imageUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
