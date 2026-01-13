interface TrendingDownIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function TrendingDownIcon({ 
  size = 24, 
  color = 'currentColor',
  className = '' 
}: TrendingDownIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trending line going down */}
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      
      {/* Arrow head */}
      <polyline points="16 17 22 17 22 11" />
    </svg>
  );
}
