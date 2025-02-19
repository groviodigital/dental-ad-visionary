
import { useEffect, useRef } from "react";

const LogoSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    let animationFrameId: number;
    let position = 0;

    const animate = () => {
      position -= 0.5;
      if (position <= -50) {
        position = 0;
      }
      if (slider) {
        slider.style.transform = `translateX(${position}%)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const logos = [
    {
      src: "/lovable-uploads/ea39a625-79fa-4e6a-9772-d54a52b696a9.png",
      alt: "Maple Ridge Smiles Dental"
    },
    {
      src: "/lovable-uploads/906c8dda-3502-4337-ae94-3993ca4bf9eb.png",
      alt: "TruShine Dental"
    },
    {
      src: "/lovable-uploads/43854c9d-9abe-47c0-bc29-c6837494abc2.png",
      alt: "Kings Dental Specialists"
    }
  ];

  // Duplicate logos for seamless infinite scroll
  const allLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden bg-white py-12">
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex gap-16 transition-transform duration-100 ease-linear"
          style={{ width: "200%" }}
        >
          {allLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-none w-[200px] h-[100px] relative group"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-full object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;
