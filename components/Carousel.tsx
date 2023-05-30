import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const settings = {
  arrows: false,
  infinite: false,
  centerMode: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: true,
  adaptiveHeight: true,
};

export default function Carousel() {
  return (
    <Slider {...settings}>
      <div>
        <div className="h-[155px] mx-[20px] bg-[#D9D9D9] rounded-[16px] flex justify-center items-center">
          Carousel
        </div>
      </div>
      <div>
        <div className="h-[155px] mx-[20px] bg-[#D9D9D9] rounded-[16px] flex justify-center items-center">
          Carousel
        </div>
      </div>
      <div>
        <div className="h-[155px] mx-[20px] bg-[#D9D9D9] rounded-[16px] flex justify-center items-center">
          Carousel
        </div>
      </div>
      <div>
        <div className="h-[155px] mx-[20px] bg-[#D9D9D9] rounded-[16px] flex justify-center items-center">
          Carousel
        </div>
      </div>
      <div>
        <div className="h-[155px] mx-[20px] bg-[#D9D9D9] rounded-[16px] flex justify-center items-center">
          Carousel
        </div>
      </div>
    </Slider>
  );
}
