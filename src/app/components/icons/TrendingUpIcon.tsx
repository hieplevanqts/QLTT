interface TrendingUpIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function TrendingUpIcon({ 
  size = 24, 
  color = 'currentColor',
  className = '' 
}: TrendingUpIconProps) {
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
      {/* Trending line going up */}
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      
      {/* Arrow head */}
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
