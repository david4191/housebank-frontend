import React, { useState, useEffect } from 'react';
import { IconCarambolaFilled } from '@tabler/icons-react';
import {
  IGenerateStarsProps,
  ITestimonialCarouselProps,
  ITestimonialProps,
} from '../types/user.ts';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const GenerateStarsHTML: React.FC<IGenerateStarsProps> = ({
  rating,
  size = 24,
}) => {
  const maxRating = 5;
  return (
    <>
      {Array.from({ length: maxRating }).map((_, idx) => {
        const filled = idx < rating;
        return (
          <IconCarambolaFilled
            key={idx}
            color={`${filled ? '#ffdf20' : '#f9f9f9'}`}
            size={size}
          />
        );
      })}
    </>
  );
};

const Testimonial: React.FC<ITestimonialProps> = ({
  title,
  imageUrl,
  name,
  rating,
}) => {
  return (
    <div className="keen-slider__slide p-8 rounded-4xl bg-[color:var(--color-teal)]">
      <span className="w-fit flex gap-2 mb-2">
        <GenerateStarsHTML rating={rating} size={21} />
      </span>
      <p className="text-base leading-6 mb-2">{title}</p>
      <div className="flex items-center">
        <img
          src={imageUrl}
          alt={name}
          className="w-10 h-10 rounded-full bg-[color:var(--color-bg)]"
        />
        <p className="text-sm leading-5 ml-2 font-bold">{name}</p>
      </div>
    </div>
  );
};

const TestimonialCarousel: React.FC<ITestimonialCarouselProps> = ({
  testimonials,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (loaded && instanceRef.current) {
        instanceRef.current.next();
      }
    }, 3000); // Change slide every 3 seconds

    return () => {
      clearInterval(interval);
    };
  }, [loaded, instanceRef]);

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden">
      <div ref={sliderRef} className="keen-slider">
        {testimonials.map((testimonial, index) => (
          <Testimonial
            key={index}
            title={testimonial.title}
            imageUrl={testimonial.imageUrl}
            name={testimonial.name}
            rating={testimonial.rating}
          />
        ))}
      </div>
      {loaded && instanceRef.current && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(testimonials.length).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === idx
                  ? 'bg-[color:var(--color-main)]'
                  : 'bg-[color:var(--color-disabled)]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;