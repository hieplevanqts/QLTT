/**
 * MiniTrend - Component hiển thị mini chart xu hướng
 */

import React from 'react';
import styles from './MiniTrend.module.css';

interface MiniTrendProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

export const MiniTrend: React.FC<MiniTrendProps> = ({ 
  data, 
  color, 
  width = 100, 
  height = 40 
}) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Tạo SVG path cho line chart
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  return (
    <svg 
      width={width} 
      height={height} 
      className={styles.miniTrend}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
