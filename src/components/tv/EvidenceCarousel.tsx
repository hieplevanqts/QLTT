import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTvData } from '@/contexts/TvDataContext';

interface EvidenceCarouselProps {
  scene: number;
}

export default function EvidenceCarousel({ scene }: EvidenceCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { filteredEvidences } = useTvData();

  const slides = filteredEvidences.slice(0, 12);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  const isHighlighted = scene === 4;

  if (slides.length === 0) {
    return (
      <div 
        className={`bg-card rounded-lg border border-border overflow-hidden transition-all ${
          isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        style={{ height: '220px', display: 'flex', flexDirection: 'column' }}
      >
        <div className="bg-muted/50 border-b border-border flex items-center justify-between flex-shrink-0" style={{ height: '38px', padding: '0 12px' }}>
          <h3 className="font-semibold text-foreground" style={{ fontSize: '12px' }}>Kho minh chứng / Hình ảnh nổi bật</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Không có minh chứng phù hợp với bộ lọc</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>Thử điều chỉnh bộ lọc để xem thêm</p>
          </div>
        </div>
      </div>
    );
  }

  const currentData = slides[currentSlide];

  return (
    <div 
      className={`bg-card rounded-lg border border-border overflow-hidden transition-all ${
        isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{ height: '220px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="bg-muted/50 border-b border-border flex items-center justify-between flex-shrink-0" style={{ height: '38px', padding: '0 12px' }}>
        <h3 className="font-semibold text-foreground" style={{ fontSize: '12px' }}>Kho minh chứng / Hình ảnh nổi bật</h3>
        <Button variant="ghost" size="sm" className="gap-1" style={{ height: '28px', fontSize: '11px', padding: '0 8px' }}>
          <Eye style={{ width: '12px', height: '12px' }} />
          Xem kho
        </Button>
      </div>

      <div className="relative flex-1">
        <div className="relative h-full overflow-hidden bg-muted/20">
          <img
            src={currentData.image_url}
            alt="Evidence"
            className="w-full h-full object-cover fade-in"
            key={currentData.id}
          />
          
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white font-medium rounded" style={{ fontSize: '10px', padding: '4px 8px' }}>
            MAPPA
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0" style={{ padding: '12px' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-white/90" style={{ fontSize: '10px', marginBottom: '4px' }}>
                  <span>{formatDate(currentData.created_at)}</span>
                  <span>•</span>
                  <span>{currentData.dia_ban.ward || currentData.dia_ban.district}</span>
                  <span>•</span>
                  <span>{currentData.chuyen_de}</span>
                </div>
                <div 
                  className={`inline-flex items-center rounded font-medium ${
                    currentData.status === 'Đã duyệt'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : currentData.status === 'Chờ duyệt'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                  style={{ fontSize: '10px', padding: '2px 8px' }}
                >
                  {currentData.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="pointer-events-auto bg-black/40 hover:bg-black/60 border-white/20 text-white"
            style={{ height: '32px', width: '32px' }}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="pointer-events-auto bg-black/40 hover:bg-black/60 border-white/20 text-white"
            style={{ height: '32px', width: '32px' }}
          >
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 bg-muted/30" style={{ padding: '10px' }}>
        {slides.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-primary'
                : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
        {slides.length > 10 && (
          <span className="text-muted-foreground ml-1" style={{ fontSize: '10px' }}>+{slides.length - 10}</span>
        )}
      </div>
    </div>
  );
}
