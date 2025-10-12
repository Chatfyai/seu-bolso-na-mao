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
  const totalSlides = Math.max(1, cards.length - itemsPerView + 1); // Para 4 cards = 3 slides
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
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].pageX;
    const currentY = e.touches[0].pageY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    // Só processar se o movimento horizontal for maior que vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      setDragDistance(deltaX);
    } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Se for movimento vertical, cancelar o dragging
      setIsDragging(false);
      setDragDistance(0);
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
      } else if (dragDistance < 0 && currentIndex < maxIndex) {
        // Arrastar para esquerda - avançar
        goToSlide(currentIndex + 1);
      }
    }
    
    setDragDistance(0);
  };

  const goToSlide = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
  }, [maxIndex]);

  // Adicionar navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
        goToSlide(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, maxIndex, goToSlide]);

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
        className={`overflow-hidden select-none w-full ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{ touchAction: 'pan-y' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`flex gap-4 transition-transform duration-400 ease-in-out ${isDragging ? 'transition-none' : ''}`}
          style={{ 
            transform: `translateX(calc(-${currentIndex * 50}% + ${isDragging ? dragDistance : 0}px))`
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
        <div className="flex justify-center mt-4 gap-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                index === currentIndex 
                  ? 'bg-[#3ecf8e] shadow-sm scale-110' 
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
