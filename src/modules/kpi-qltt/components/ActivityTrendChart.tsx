/**
 * ActivityTrendChart - Biểu đồ xu hướng hoạt động
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import styles from './ActivityTrendChart.module.css';

interface TrendData {
  label: string;
  value: number;
  percentage: number;
}

interface ActivityTrendChartProps {
  data: TrendData[];
}

export const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({ data }) => {
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--border)"
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            type="number"
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'Inter' }}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis 
            type="category"
            dataKey="label"
            stroke="var(--muted-foreground)"
            tick={{ fill: 'var(--foreground)', fontSize: 13, fontFamily: 'Inter' }}
            axisLine={{ stroke: 'var(--border)' }}
            width={180}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            barSize={24}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.percentage >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className={styles.percentageLabels}>
        {data.map((item, index) => (
          <div 
            key={index} 
            className={styles.percentageItem}
            style={{ 
              top: `${20 + index * 80}px`,
            }}
          >
            <span 
              className={styles.percentageValue}
              data-positive={item.percentage >= 0}
            >
              {item.percentage > 0 ? '+' : ''}{item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
