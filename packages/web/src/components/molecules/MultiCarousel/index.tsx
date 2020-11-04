import React, { FC } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './MultiCarousel.scss';

interface IProps {
  children: React.PropsWithChildren<{}>;
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
    slidesToSlide: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const Index: FC<IProps> = (props: IProps) => {
  const { children } = props;
  return (
    <Carousel
      arrows={false}
      autoPlay
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

export default Index;
