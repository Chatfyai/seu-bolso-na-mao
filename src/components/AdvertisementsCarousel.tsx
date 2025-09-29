import React, { useState, useRef, useEffect, useCallback } from 'react';

type Advertisement = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  backgroundColor?: string;
};

const AdvertisementsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dados de exemplo para anúncios
  const advertisements: Advertisement[] = [
    {
      id: '1',
      title: 'Investimentos Inteligentes',
      description: 'Aprenda a investir com segurança e maximizar seus rendimentos',
      imageUrl: '/placeholder-ad-1.jpg',
      linkUrl: '#',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: '2',
      title: 'Cartão de Crédito Premium',
      description: 'Cashback de até 5% em todas as compras',
      imageUrl: '/placeholder-ad-2.jpg',
      linkUrl: '#',
      backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: '3',
      title: 'Seguro de Vida',
      description: 'Proteja sua família com o melhor seguro do mercado',
      imageUrl: '/placeholder-ad-3.jpg',
      linkUrl: '#',
      backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: '4',
      title: 'Empréstimo Pessoal',
      description: 'Taxa especial para clientes - Aprovação em minutos',
      imageUrl: '/placeholder-ad-4.jpg',
      linkUrl: '#',
      backgroundColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const totalSlides = advertisements.length;
  const threshold = 50; // Distância mínima para trocar de slide

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    setDragDistance(walk);
  };

  const handleMouseUp = () => {
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
    
    // Só processar se o movimento horizontal for maior que vertical
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

  // Auto-play (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [totalSlides]);

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
          className={`flex transition-transform duration-500 ease-in-out ${isDragging ? 'transition-none' : ''}`}
          style={{ 
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? dragDistance : 0}px))`
          }}
        >
          {advertisements.map((ad) => (
            <div 
              key={ad.id}
              className="flex-shrink-0 w-full px-3"
            >
              <div 
                className="relative rounded-xl overflow-hidden shadow-lg h-24 cursor-pointer"
                style={{ background: ad.backgroundColor }}
                onClick={() => ad.linkUrl && window.open(ad.linkUrl, '_blank')}
              >
                {/* Conteúdo do anúncio */}
                <div className="absolute inset-0 p-3 flex items-center justify-between">
                  <div className="flex-1 text-white">
                    <h3 className="text-base font-bold mb-1">{ad.title}</h3>
                    <p className="text-xs opacity-90">{ad.description}</p>
                  </div>
                  
                  {/* Placeholder para imagem */}
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">
                      image
                    </span>
                  </div>
                </div>

                {/* Overlay para melhor legibilidade */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdvertisementsCarousel;
