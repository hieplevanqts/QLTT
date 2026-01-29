import { Restaurant } from '../../../../data/restaurantData';
import { getCategoryColor, getCategoryLabel } from './categoryUtils';

/**
 * Generate popup HTML content for a restaurant marker
 */
export function generatePopupContent(restaurant: Restaurant): string {
  const color = getCategoryColor(restaurant.category);
  const categoryLabel = getCategoryLabel(restaurant.category);

  return `
    <div class="leaflet-popup-custom" style="font-family: 'Inter', sans-serif; min-width: 260px;">
      <!-- Category Badge -->
      <div style="
        position: relative;
        margin: -12px -12px 0 -12px;
        padding: 12px 16px;
        background: linear-gradient(135deg, ${color} 0%, ${color}ee 100%);
        color: white;
        border-radius: 8px 8px 0 0;
      ">
        <div style="
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          opacity: 0.9;
          margin-bottom: 4px;
        ">${categoryLabel}</div>
        <div style="
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
          color: white;
        ">${restaurant.name}</div>
      </div>
      
      <!-- Content -->
      <div style="padding: 16px 0 12px 0;">
        <!-- ID Badge -->
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #f3f4f6;
          border-radius: 6px;
          margin-bottom: 14px;
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style="
            font-size: 11px;
            font-weight: 600;
            color: #374151;
            letter-spacing: 0.3px;
          ">MST: ${restaurant.taxCode || 'N/A'}</span>
        </div>
        
        <!-- Info Items -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; gap: 10px;">
            <div style="
              width: 28px;
              height: 28px;
              flex-shrink: 0;
              background: #eff6ff;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005cb6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
              </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="
                font-size: 10px;
                font-weight: 600;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                margin-bottom: 3px;
              ">Loại hình</div>
              <div style="
                font-size: 13px;
                font-weight: 500;
                color: #111827;
                line-height: 1.3;
              ">${restaurant.type}</div>
            </div>
          </div>
          
          <div style="display: flex; gap: 10px;">
            <div style="
              width: 28px;
              height: 28px;
              flex-shrink: 0;
              background: #fef3f2;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="
                font-size: 10px;
                font-weight: 600;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                margin-bottom: 3px;
              ">Địa chỉ</div>
              <div style="
                font-size: 13px;
                font-weight: 400;
                color: #374151;
                line-height: 1.4;
              ">${restaurant.address}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Button -->
      <div style="
        padding: 12px 0 0 0;
        border-top: 1px solid #e5e7eb;
      ">
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        ">
          <button 
            onclick="window.openPointReview('${restaurant.id}')"
            style="
              padding: 10px 14px;
              background: white;
              color: ${color};
              border: 1px solid ${color};
              border-radius: 8px;
              font-family: 'Inter', sans-serif;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            "
            onmouseover="this.style.background='${color}'; this.style.color='white'"
            onmouseout="this.style.background='white'; this.style.color='${color}'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Đánh giá
          </button>
          
          <button 
            onclick="event.stopPropagation(); event.preventDefault(); window.openPointDetail('${restaurant.id}', event);"
            style="
              padding: 10px 14px;
              background: ${color};
              color: white;
              border: none;
              border-radius: 8px;
              font-family: 'Inter', sans-serif;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            "
            onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'"
            onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  `;
}

