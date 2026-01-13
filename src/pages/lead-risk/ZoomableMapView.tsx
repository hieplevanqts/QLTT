import { useState, useRef, useEffect, ReactNode } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import styles from './SLAOperationMap.module.css';

interface Props {
  children: ReactNode;
}

export default function ZoomableMapView({ children }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 0.3;  // Zoom out xa hơn
  const MAX_SCALE = 20;   // Zoom in cực cận - không giới hạn thực tế
  const ZOOM_STEP = 0.3;  // Zoom step lớn hơn cho smooth

  // Handle wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
      
      if (newScale !== scale) {
        // Zoom towards mouse cursor
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const scaleRatio = newScale / scale;
        const newX = mouseX - (mouseX - position.x) * scaleRatio;
        const newY = mouseY - (mouseY - position.y) * scaleRatio;
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scale, position]);

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Zoom buttons
  const zoomIn = () => {
    const newScale = Math.min(MAX_SCALE, scale + ZOOM_STEP);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(MIN_SCALE, scale - ZOOM_STEP);
    setScale(newScale);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      className={styles.zoomableContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Zoomable Content */}
      <div
        className={styles.zoomableContent}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {children}
      </div>

      {/* Zoom Controls */}
      <div className={styles.zoomControls}>
        <button
          className={styles.zoomBtn}
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          title="Phóng to (Zoom in)"
        >
          <ZoomIn size={18} />
        </button>
        <div className={styles.zoomLevel}>{Math.round(scale * 100)}%</div>
        <button
          className={styles.zoomBtn}
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          title="Thu nhỏ (Zoom out)"
        >
          <ZoomOut size={18} />
        </button>
        <button
          className={styles.zoomBtn}
          onClick={resetZoom}
          title="Đặt lại (Reset)"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
}