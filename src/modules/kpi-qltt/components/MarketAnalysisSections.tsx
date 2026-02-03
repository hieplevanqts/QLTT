import { useMemo } from 'react';
import { cn } from '@/components/ui/utils';
import styles from '../pages/KpiQlttDashboard.module.css';

interface StoreData {
  id: number;
  name: string;
  industry: string;
  businessType: string;
  status: string;
  area: number;
  revenue: number;
  district: string;
}

interface IndustryStandard {
  industry: string;
  requiredArea: number;
  optimalDensity: number;
  avgRevenue: number;
}

interface AnalysisResult {
  industry: string;
  district: string;
  storeCount: number;
  avgArea: number;
  requiredArea: number;
  complianceRate: number;
  density: number;
  optimalDensity: number;
  avgRevenue: number;
  expectedRevenue: number;
  saturationLevel: 'Thấp' | 'Trung bình' | 'Cao';
  recommendation: string;
}

const INDUSTRY_STANDARDS: IndustryStandard[] = [
  { industry: 'Thực phẩm và đồ uống', requiredArea: 45, optimalDensity: 0.40, avgRevenue: 180 },
  { industry: 'Y tế', requiredArea: 35, optimalDensity: 0.20, avgRevenue: 260 },
  { industry: 'Bán lẻ', requiredArea: 40, optimalDensity: 0.35, avgRevenue: 200 },
  { industry: 'Công nghệ', requiredArea: 30, optimalDensity: 0.18, avgRevenue: 350 },
  { industry: 'Dịch vụ', requiredArea: 25, optimalDensity: 0.25, avgRevenue: 150 },
  { industry: 'Thời trang và mỹ phẩm', requiredArea: 35, optimalDensity: 0.30, avgRevenue: 220 },
];

// Mock population per district (people)
const DISTRICT_POPULATION: { [key: string]: number } = {
  'Q1': 120000, 'Q2': 135000, 'Q3': 145000, 'Q4': 150000, 'Q5': 160000,
  'Q6': 140000, 'Q7': 130000, 'Q8': 125000, 'Q9': 118000, 'Q10': 142000,
  'Q11': 128000, 'Q12': 138000,
  'Quận Bình Thạnh': 155000, 'Quận Gò Vấp': 162000, 
  'Quận Tân Bình': 148000, 'Quận Phú Nhuận': 125000
};

interface MarketAnalysisSectionsProps {
  stores: StoreData[];
  hasActiveFilters: boolean; // Add flag to know if filters are active
}

export function MarketAnalysisSections({ stores, hasActiveFilters }: MarketAnalysisSectionsProps) {
  // Calculate OVERALL summary when no filters
  const overallSummary = useMemo(() => {
    if (stores.length === 0) return null;

    const totalStores = stores.length;
    const totalArea = stores.reduce((sum, s) => sum + s.area, 0);
    const avgArea = totalArea / totalStores;
    const totalRevenue = stores.reduce((sum, s) => sum + s.revenue, 0);
    const avgRevenue = totalRevenue / totalStores;

    // Calculate average required area across all stores based on their industry
    let totalRequiredArea = 0;
    let totalOptimalDensity = 0;
    let storesWithStandards = 0;

    stores.forEach(store => {
      const standard = INDUSTRY_STANDARDS.find(s => s.industry === store.industry);
      if (standard) {
        totalRequiredArea += standard.requiredArea;
        totalOptimalDensity += standard.optimalDensity;
        storesWithStandards++;
      }
    });

    const avgRequiredArea = storesWithStandards > 0 ? totalRequiredArea / storesWithStandards : 40;
    const avgOptimalDensity = storesWithStandards > 0 ? totalOptimalDensity / storesWithStandards : 0.30;

    // Calculate compliance rate
    const compliantStores = stores.filter(store => {
      const standard = INDUSTRY_STANDARDS.find(s => s.industry === store.industry);
      return standard && store.area >= standard.requiredArea;
    }).length;
    const complianceRate = (compliantStores / totalStores) * 100;

    // Calculate overall density (all stores / total population)
    const totalPopulation = Object.values(DISTRICT_POPULATION).reduce((sum, pop) => sum + pop, 0);
    const density = (totalStores / totalPopulation) * 1000;

    // Determine saturation level
    let saturationLevel: 'Thấp' | 'Trung bình' | 'Cao';
    if (density > avgOptimalDensity * 1.3) {
      saturationLevel = 'Cao';
    } else if (density < avgOptimalDensity * 0.7) {
      saturationLevel = 'Thấp';
    } else {
      saturationLevel = 'Trung bình';
    }

    // Generate recommendation
    let recommendation = '';
    if (saturationLevel === 'Cao') {
      recommendation = 'Cân nhắc kỹ trước khi cấp phép thêm';
    } else if (saturationLevel === 'Thấp') {
      recommendation = 'Khuyến khích cấp phép thêm';
    } else {
      recommendation = 'Có thể cấp phép thêm';
    }

    return {
      totalStores,
      avgArea,
      avgRequiredArea,
      complianceRate,
      density,
      avgOptimalDensity,
      avgRevenue,
      saturationLevel,
      recommendation,
    };
  }, [stores]);

  // Calculate detailed analysis results (when filters active)
  const analysisResults = useMemo(() => {
    const results: AnalysisResult[] = [];

    // Group by industry and district
    const grouped: { [key: string]: StoreData[] } = {};
    
    stores.forEach(store => {
      const key = `${store.industry}|${store.district}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(store);
    });

    // Calculate metrics for each group
    Object.entries(grouped).forEach(([key, groupStores]) => {
      const [industry, district] = key.split('|');
      const standard = INDUSTRY_STANDARDS.find(s => s.industry === industry);
      
      if (!standard) return;

      const storeCount = groupStores.length;
      const totalArea = groupStores.reduce((sum, s) => sum + s.area, 0);
      const avgArea = totalArea / storeCount;
      const totalRevenue = groupStores.reduce((sum, s) => sum + s.revenue, 0);
      const avgRevenue = totalRevenue / storeCount;

      // Calculate compliance rate (stores meeting area standard)
      const compliantStores = groupStores.filter(s => s.area >= standard.requiredArea).length;
      const complianceRate = (compliantStores / storeCount) * 100;

      // Calculate density (stores per 1000 people)
      const population = DISTRICT_POPULATION[district] || 100000;
      const density = (storeCount / population) * 1000;

      // Determine saturation level
      let saturationLevel: 'Thấp' | 'Trung bình' | 'Cao';
      if (density > standard.optimalDensity * 1.3) {
        saturationLevel = 'Cao';
      } else if (density < standard.optimalDensity * 0.7) {
        saturationLevel = 'Thấp';
      } else {
        saturationLevel = 'Trung bình';
      }

      // Generate recommendation
      let recommendation = '';
      if (saturationLevel === 'Cao') {
        recommendation = 'Cân nhắc kỹ trước khi cấp phép thêm';
      } else if (saturationLevel === 'Thấp') {
        recommendation = 'Khuyến khích cấp phép thêm';
      } else {
        recommendation = 'Có thể cấp phép thêm';
      }

      results.push({
        industry,
        district,
        storeCount,
        avgArea,
        requiredArea: standard.requiredArea,
        complianceRate,
        density,
        optimalDensity: standard.optimalDensity,
        avgRevenue,
        expectedRevenue: standard.avgRevenue,
        saturationLevel,
        recommendation,
      });
    });

    return results.sort((a, b) => {
      // Sort by industry first, then district
      const industryCompare = a.industry.localeCompare(b.industry);
      if (industryCompare !== 0) return industryCompare;
      return a.district.localeCompare(b.district);
    });
  }, [stores]);

  const hasResults = analysisResults.length > 0;

  // Decide what to show: summary or detailed
  const showSummary = !hasActiveFilters && overallSummary;
  const showDetailed = hasActiveFilters && hasResults;

  return (
    <>
      {/* Area Analysis Section */}
      <div className={styles.analysisCard}>
        <h3 className={styles.sectionTitle}>Đánh giá diện tích cửa hàng so với chuẩn</h3>
        <p className={styles.analysisDescription}>
          {showSummary 
            ? 'Tổng quan về tỷ lệ đạt chuẩn diện tích kinh doanh trên toàn địa bàn. Sử dụng bộ lọc để xem chi tiết từng ngành và khu vực.'
            : 'Sử dụng bộ lọc ở trên (Ngành hàng và Quận/Huyện) để xem phân tích chi tiết về tỷ lệ đạt chuẩn diện tích kinh doanh'
          }
        </p>

        {/* Show Overall Summary when NO filters */}
        {showSummary && (
          <div className={styles.saturationGrid}>
            <div className={styles.saturationItem}>
              <div className={styles.saturationHeader}>
                <span className={styles.saturationIndustry}>
                  Tổng quan toàn địa bàn
                </span>
                <span className={cn(
                  styles.saturationLevel,
                  overallSummary.complianceRate >= 90 ? styles.levelHigh :
                  overallSummary.complianceRate < 70 ? styles.levelLow : styles.levelMedium
                )}>
                  {overallSummary.complianceRate.toFixed(0)}% đạt chuẩn
                </span>
              </div>
              <p className={styles.saturationDesc}>
                Diện tích TB: <strong>{overallSummary.avgArea.toFixed(1)}m²</strong> (Chuẩn TB: {overallSummary.avgRequiredArea.toFixed(0)}m²). 
                {' '}{(100 - overallSummary.complianceRate).toFixed(0)}% cửa hàng dưới chuẩn. 
                {' '}{overallSummary.totalStores} cơ sở trên toàn địa bàn.
                {overallSummary.complianceRate < 70 && ' Cần tăng cường kiểm tra.'}
                {overallSummary.complianceRate >= 90 && ' Tuân thủ tốt điều kiện kinh doanh.'}
                {overallSummary.complianceRate >= 70 && overallSummary.complianceRate < 90 && ' Cần theo dõi điều kiện kinh doanh.'}
              </p>
            </div>
          </div>
        )}

        {/* Show Detailed Results when filters active */}
        {!showSummary && !showDetailed && (
          <div className={styles.emptyState}>
            <p>Không có dữ liệu phù hợp với bộ lọc đã chọn</p>
          </div>
        )}

        {showDetailed && (
          <div className={styles.saturationGrid}>
            {analysisResults.map((result, index) => {
              const belowStandardPercent = 100 - result.complianceRate;
              const isHigh = result.complianceRate >= 90;
              const isLow = result.complianceRate < 70;
              
              return (
                <div key={index} className={styles.saturationItem}>
                  <div className={styles.saturationHeader}>
                    <span className={styles.saturationIndustry}>
                      {result.industry} - {result.district}
                    </span>
                    <span className={cn(
                      styles.saturationLevel,
                      isHigh ? styles.levelHigh : isLow ? styles.levelLow : styles.levelMedium
                    )}>
                      {result.complianceRate.toFixed(0)}% đạt chuẩn
                    </span>
                  </div>
                  <p className={styles.saturationDesc}>
                    Diện tích TB: <strong>{result.avgArea.toFixed(1)}m²</strong> (Chuẩn: {result.requiredArea}m²). 
                    {' '}{belowStandardPercent.toFixed(0)}% cửa hàng dưới chuẩn. 
                    {' '}{result.storeCount} cơ sở trong khu vực.
                    {isLow && ' Cần tăng cường kiểm tra.'}
                    {isHigh && ' Tuân thủ tốt điều kiện kinh doanh.'}
                    {!isLow && !isHigh && ' Cần theo dõi điều kiện kinh doanh.'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Market Saturation Analysis */}
      <div className={styles.analysisCard}>
        <h3 className={styles.sectionTitle}>Đánh giá mức độ bão hòa thị trường</h3>
        <p className={styles.analysisDescription}>
          {showSummary
            ? 'Đánh giá tổng hợp về mức độ bão hòa thị trường trên toàn địa bàn. Sử dụng bộ lọc để xem chi tiết từng ngành và khu vực.'
            : 'Đánh giá tổng hợp dựa trên dân cư, mật độ cửa hàng, diện tích và doanh thu để hỗ trợ quyết định cấp phép kinh doanh'
          }
        </p>

        {/* Show Overall Summary when NO filters */}
        {showSummary && (
          <div className={styles.saturationGrid}>
            <div className={styles.saturationItem}>
              <div className={styles.saturationHeader}>
                <span className={styles.saturationIndustry}>
                  Tổng quan toàn địa bàn
                </span>
                <span className={cn(
                  styles.saturationLevel,
                  overallSummary.saturationLevel === 'Cao' ? styles.levelHigh :
                  overallSummary.saturationLevel === 'Thấp' ? styles.levelLow : styles.levelMedium
                )}>
                  {overallSummary.saturationLevel}
                </span>
              </div>
              <p className={styles.saturationDesc}>
                Mật độ: <strong>{overallSummary.density.toFixed(2)}/1000 dân</strong> (Chuẩn TB: {overallSummary.avgOptimalDensity.toFixed(2)}). 
                {' '}Doanh thu TB: <strong>{overallSummary.avgRevenue.toFixed(0)} tr.đ/cửa hàng</strong>. 
                {' '}{overallSummary.totalStores} cơ sở trên toàn địa bàn.
                <strong className={styles.recommendation}> Khuyến nghị: {overallSummary.recommendation}.</strong>
              </p>
            </div>
          </div>
        )}

        {/* Show Detailed Results when filters active */}
        {!showSummary && !showDetailed && (
          <div className={styles.emptyState}>
            <p>Không có dữ liệu phù hợp với bộ lọc đã chọn</p>
          </div>
        )}

        {showDetailed && (
          <div className={styles.saturationGrid}>
            {analysisResults.map((result, index) => {
              return (
                <div key={index} className={styles.saturationItem}>
                  <div className={styles.saturationHeader}>
                    <span className={styles.saturationIndustry}>
                      {result.industry} - {result.district}
                    </span>
                    <span className={cn(
                      styles.saturationLevel,
                      result.saturationLevel === 'Cao' ? styles.levelHigh :
                      result.saturationLevel === 'Thấp' ? styles.levelLow : styles.levelMedium
                    )}>
                      {result.saturationLevel}
                    </span>
                  </div>
                  <p className={styles.saturationDesc}>
                    Mật độ: <strong>{result.density.toFixed(2)}/1000 dân</strong> (Chuẩn: {result.optimalDensity}). 
                    {' '}Doanh thu TB: <strong>{result.avgRevenue.toFixed(0)} tr.đ/cửa hàng</strong>. 
                    {' '}{result.storeCount} cơ sở trong khu vực.
                    <strong className={styles.recommendation}> Khuyến nghị: {result.recommendation}.</strong>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
