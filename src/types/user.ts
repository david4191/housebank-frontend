export interface IGenerateStarsProps {
  rating: number;
  size: number;
}

export interface ITestimonialProps {
  title: string;
  imageUrl: string;
  name: string;
  rating: number;
}

export interface ITestimonalData {
  title: string;
  imageUrl: string;
  name: string;
  rating: number;
}

export interface ITestimonialCarouselProps {
  testimonials: ITestimonalData[];
}
