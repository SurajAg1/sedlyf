"use client";
import Slider from "react-slick";

export default function PhotoSlider() {
  const images = [
    "./images/offer1.jpg",
    "./images/offer2.jpg",
    "./images/white2.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="w-full mx-auto">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Offer ${index + 1}`}
              className="w-full h-[64vh] object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
