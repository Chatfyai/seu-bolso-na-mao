import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const itemsPerView = 2; // Mostrar 2 cards por vez
  const maxIndex = Math.max(0, cards.length - itemsPerView);
  // Calcular número de slides baseado no número de cards
  const totalSlides = Math.ceil(cards.length / itemsPerView);
  const threshold = 50; // Distância mínima para trocar de slide



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
    setStartX(e.touches[0].pageX);
    setStartY(e.touches[0].pageY);
    setDragDistance(0);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].pageX;
    const currentY = e.touches[0].pageY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    // Só processar se o movimento horizontal for maior que vertical (para evitar conflito com scroll vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      setDragDistance(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determinar se deve avançar ou voltar baseado na distância do drag
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && currentIndex > 0) {
        // Arrastar para direita - voltar
        goToSlide(currentIndex - 1);
      } else if (dragDistance < 0 && currentIndex < totalSlides - 1) {
        // Arrastar para esquerda - avançar
        goToSlide(currentIndex + 1);
      }
    }
    
    setDragDistance(0);
  };

  const goToSlide = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    setCurrentIndex(clampedIndex);
  }, [totalSlides]);

  // Adicionar navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < totalSlides - 1) {
        goToSlide(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalSlides, goToSlide]);

  const formatValue = (value: number, cardId: string) => {
    // Para o card de saldo, preservar o sinal negativo se o valor for negativo
    if (cardId === 'balance') {
      return value;
    }
    // Para outros cards (entradas e despesas), sempre valores absolutos
    return Math.abs(value);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className={`overflow-hidden touch-pan-y select-none w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`flex gap-4 transition-transform duration-300 ease-out ${isDragging ? 'transition-none' : ''}`}
          style={{ 
            transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% + ${isDragging ? dragDistance : 0}px))`
          }}
        >
          {cards.map((card) => (
            <div 
              key={card.id}
              className="flex-shrink-0 w-[calc(50%-8px)] min-w-[calc(50%-8px)]"
            >
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm flex items-center gap-3 h-full min-h-[80px]">
                <span 
                  className={`material-symbols-outlined text-2xl flex-shrink-0 ${card.color || 'text-[#3ecf8e]'}`}
                >
                  {card.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{card.title}</p>
                  <p className="text-lg font-bold text-foreground">
                    R$ <span className="inline">{formatValue(card.value, card.id) < 0 ? '-' : ''}</span><CountUp from={0} to={Math.abs(formatValue(card.value, card.id))} separator="." duration={1} className="inline" />
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
          {Array.from({ length: totalSlides }).map((_, index) => (
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
