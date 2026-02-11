import React from "react";
import { Testimonial } from "@/data/testimonials";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  speed?: number;
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
  speed = 30,
}) => {
  const duplicated = [...testimonials, ...testimonials];

  return (
    <section className="relative py-16 bg-background overflow-hidden">
      {/* Edge Fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div
        className="flex w-max gap-6 md:gap-8 animate-scroll hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicated.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="
              flex-shrink-0
              w-[90vw] 
              sm:w-[70vw]
              md:w-[30vw]
              lg:w-[28vw]
              bg-card
              text-card-foreground
              p-6
              rounded-xl
              border
              border-border
              shadow-md
              transition-all duration-300
              hover:-translate-y-2
            "
          >
            {/* Avatar + Name (TOP) */}
            <div className="flex flex-col items-center text-center mb-5">
                <div className="p-2 rounded-full bg-gold/20">
                    <div
                    className="
                        w-16 h-16
                        sm:w-20 sm:h-20
                        md:w-24 md:h-24
                        lg:w-28 lg:h-28
                        rounded-full
                        overflow-hidden object-cover object-center
                    "
                    >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full "
                    />
                    </div>
                </div>

                <h3 className="mt-4 text-base sm:text-lg md:text-xl font-semibold text-foreground">
                    {item.name}
                </h3>

                {item.role && (
                    <p className="text-xs sm:text-sm md:text-base text-gold mt-1">
                    {item.role}
                    </p>
                )}
                </div>

            {/* Divider */}
            <div className="h-px bg-border mb-5" />

            {/* Feedback */}
            <p className="text-muted-foreground leading-relaxed italic text-center">
              “{item.message}”
            </p>
          </div>
        ))}
      </div>

      {/* Scroll Animation */}
      <style>
        {`
            @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll linear infinite;
            width: max-content;
          }

        `}

      </style>
    </section>
  );
};

export default TestimonialSlider;
