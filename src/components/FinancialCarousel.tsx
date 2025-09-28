import React, { useState, useRef, useEffect } from 'react';
import CountUp from '@/pages/CountUp';

type FinancialCard = {
  id: string;
  icon: string;
  title: string;
  value: number;
  color?: string;
};

type FinancialCarouselProps = {
  cards: FinancialCard[];
};

const FinancialCarousel = ({ cards }: FinancialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const itemsPerView = 2; // Mostrar 2 cards por vez
  const maxIndex = Math.max(0, cards.length - itemsPerView);


  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const formatValue = (value: number) => {
    return Math.abs(value);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className={`overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {cards.map((card) => (
            <div 
              key={card.id}
              className="flex-shrink-0 w-[calc(50%-8px)]"
            >
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm flex items-center gap-3 h-full">
                <span 
                  className={`material-symbols-outlined text-2xl ${card.color || 'text-[#3ecf8e]'}`}
                >
                  {card.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{card.title}</p>
                  <p className="text-lg font-bold text-foreground">
                    R$ <CountUp from={0} to={formatValue(card.value)} separator="." duration={1} className="inline" />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots - Only show if more cards than visible */}
      {cards.length > itemsPerView && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-[#3ecf8e]' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default FinancialCarousel;
