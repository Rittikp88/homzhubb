import React, { FC } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '@homzhub/web/src/components/molecules/MultiCarousel/MultiCarousel.scss';

interface IProps {
  children: React.ReactNode;
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1200 },
    items: 3,
    slidesToSlide: 3,
  },
  desktop: {
    breakpoint: { max: 1200, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 800, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const MultiCarousel: FC<IProps> = (props: IProps) => {
  const { children } = props;
  return (
    <Carousel
      arrows={false}
      // autoPlay
      autoPlaySpeed={3000}
      draggable
      focusOnSelect={false}
      infinite
      renderDotsOutside
      responsive={responsive}
      showDots
    >
      {children}
    </Carousel>
  );
};

export default MultiCarousel;
