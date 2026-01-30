import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, User, FileText, Tag, ChevronLeft, ChevronRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTvData } from '@/contexts/TvDataContext';

interface CitizenReportsGalleryProps {
  scene: number;
}

export default function CitizenReportsGallery({ scene }: CitizenReportsGalleryProps) {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { filteredLeads } = useTvData();

  // Get top 12 latest reports with images
  const reports = filteredLeads.slice(0, 12);

  const isHighlighted = scene === 4;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  // Generate image for each report (use real images when available)
  const getReportImage = (report: any) => {
    if (Array.isArray(report.images) && report.images.length > 0) {
      return report.images[0];
    }
    const imageMap: Record<string, string> = {
      'Hàng giả – Hàng nhái': 'https://images.unsplash.com/photo-1678693361607-2b7b66dce8f3?w=800',
      'Gian lận thương mại': 'https://images.unsplash.com/photo-1580320478238-9be2382b2a47?w=800',
      'An toàn thực phẩm': 'https://images.unsplash.com/photo-1609819390597-783ccdfc2529?w=800',
      'Vi phạm về giá': 'https://images.unsplash.com/photo-1754327440237-52725649bf03?w=800',
      'Kinh doanh trái phép': 'https://images.unsplash.com/photo-1652957704659-be73b3873541?w=800',
      'Buôn lậu – Vận chuyển trái phép': 'https://images.unsplash.com/photo-1740313498340-48156c8eee07?w=800',
      'Thương mại điện tử & Mạng xã hội': 'https://images.unsplash.com/photo-1658297063569-162817482fb6?w=800',
      'Quảng cáo sai phạm': 'https://images.unsplash.com/photo-1677208198308-779c9c785a1c?w=800',
      'Thuốc – Mỹ phẩm – Thiết bị y tế': 'https://images.unsplash.com/photo-1621770522713-8b47c60a6227?w=800',
      'Hàng hóa không rõ nguồn gốc': 'https://images.unsplash.com/photo-1567570671138-76c7e06caa3b?w=800',
      'Vi phạm trong dịp cao điểm': 'https://images.unsplash.com/photo-1636036504644-1c353ae986f5?w=800',
      'Nghi vấn / Dấu hiệu bất thường': 'https://images.unsplash.com/photo-1763144536757-d90b9144e6ef?w=800',
    };
    return imageMap[report.chuyen_de] || 'https://images.unsplash.com/photo-1754638335233-e29065d73bb4?w=800';
  };

  // Generate multiple images for each report (fallback to mock images)
  const getReportImages = (report: any): string[] => {
    if (Array.isArray(report.images) && report.images.length > 0) {
      return report.images;
    }
    const allImages: Record<string, string[]> = {
      'Hàng giả – Hàng nhái': [
        'https://images.unsplash.com/photo-1678693361607-2b7b66dce8f3?w=800',
        'https://images.unsplash.com/photo-1672839946212-aee298e40923?w=800',
        'https://images.unsplash.com/photo-1674471361523-195aa08e69b5?w=800',
      ],
      'Gian lận thương mại': [
        'https://images.unsplash.com/photo-1580320478238-9be2382b2a47?w=800',
        'https://images.unsplash.com/photo-1674471361523-195aa08e69b5?w=800',
        'https://images.unsplash.com/photo-1606824722920-4c652a70f348?w=800',
      ],
      'An toàn thực phẩm': [
        'https://images.unsplash.com/photo-1609819390597-783ccdfc2529?w=800',
        'https://images.unsplash.com/photo-1762592957827-99db60cfd0c7?w=800',
        'https://images.unsplash.com/photo-1606824722920-4c652a70f348?w=800',
        'https://images.unsplash.com/photo-1677208198308-779c9c785a1c?w=800',
      ],
      'Vi phạm về giá': [
        'https://images.unsplash.com/photo-1754327440237-52725649bf03?w=800',
        'https://images.unsplash.com/photo-1606824722920-4c652a70f348?w=800',
        'https://images.unsplash.com/photo-1580320478238-9be2382b2a47?w=800',
      ],
      'Kinh doanh trái phép': [
        'https://images.unsplash.com/photo-1652957704659-be73b3873541?w=800',
        'https://images.unsplash.com/photo-1754638335233-e29065d73bb4?w=800',
        'https://images.unsplash.com/photo-1677208198308-779c9c785a1c?w=800',
      ],
      'Buôn lậu – Vận chuyển trái phép': [
        'https://images.unsplash.com/photo-1740313498340-48156c8eee07?w=800',
        'https://images.unsplash.com/photo-1664382950442-0748f82f2752?w=800',
        'https://images.unsplash.com/photo-1754638335233-e29065d73bb4?w=800',
      ],
      'Thương mại điện tử & Mạng xã hội': [
        'https://images.unsplash.com/photo-1658297063569-162817482fb6?w=800',
        'https://images.unsplash.com/photo-1740479049023-5ccc930f7aa5?w=800',
        'https://images.unsplash.com/photo-1606824722920-4c652a70f348?w=800',
        'https://images.unsplash.com/photo-1580320478238-9be2382b2a47?w=800',
      ],
      'Quảng cáo sai phạm': [
        'https://images.unsplash.com/photo-1677208198308-779c9c785a1c?w=800',
        'https://images.unsplash.com/photo-1762592957827-99db60cfd0c7?w=800',
        'https://images.unsplash.com/photo-1674471361523-195aa08e69b5?w=800',
      ],
      'Thuốc – Mỹ phẩm – Thiết bị y tế': [
        'https://images.unsplash.com/photo-1621770522713-8b47c60a6227?w=800',
        'https://images.unsplash.com/photo-1595464144526-5fb181b74625?w=800',
        'https://images.unsplash.com/photo-1584791565158-a3da481054bc?w=800',
      ],
      'Hàng hóa không rõ nguồn gốc': [
        'https://images.unsplash.com/photo-1567570671138-76c7e06caa3b?w=800',
        'https://images.unsplash.com/photo-1584791565158-a3da481054bc?w=800',
        'https://images.unsplash.com/photo-1580320478238-9be2382b2a47?w=800',
      ],
      'Vi phạm trong dịp cao điểm': [
        'https://images.unsplash.com/photo-1636036504644-1c353ae986f5?w=800',
        'https://images.unsplash.com/photo-1677208198308-779c9c785a1c?w=800',
        'https://images.unsplash.com/photo-1762592957827-99db60cfd0c7?w=800',
      ],
      'Nghi vấn / Dấu hiệu bất thường': [
        'https://images.unsplash.com/photo-1763144536757-d90b9144e6ef?w=800',
        'https://images.unsplash.com/photo-1664382950442-0748f82f2752?w=800',
        'https://images.unsplash.com/photo-1754638335233-e29065d73bb4?w=800',
      ],
    };

    const images = allImages[report.chuyen_de] || allImages['Hàng giả – Hàng nhái'];
    // Return 2-4 images based on report ID
    const count = 2 + (report.id.charCodeAt(0) % 3); // 2, 3, or 4 images
    return images.slice(0, count);
  };

  // Reset image index when report changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedReport?.id]);

  // Generate mock reporter name
  const getReporterName = (report: any) => {
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Võ', 'Đặng', 'Bùi'];
    const lastNames = ['Văn A', 'Thị B', 'Văn C', 'Thị D', 'Văn E', 'Thị F'];
    const firstName = firstNames[report.id.charCodeAt(0) % firstNames.length];
    const lastName = lastNames[report.id.charCodeAt(1) % lastNames.length];
    return `${firstName} ${lastName}`;
  };

  // Generate mock phone number
  const getReporterPhone = (report: any) => {
    const prefixes = ['090', '091', '094', '088', '086', '096', '097', '098'];
    const prefix = prefixes[report.id.charCodeAt(2) % prefixes.length];
    const suffix = String(report.id.charCodeAt(0) * report.id.charCodeAt(1)).padStart(7, '0').slice(0, 7);
    return `${prefix}${suffix}`;
  };

  // Generate mock email
  const getReporterEmail = (report: any) => {
    const name = getReporterName(report).toLowerCase().replace(/\s+/g, '.');
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const domain = domains[report.id.charCodeAt(3) % domains.length];
    return `${name}@${domain}`;
  };

  // Generate mock description
  const getDescription = (report: any) => {
    const descriptions: Record<string, string> = {
      'Hàng giả – Hàng nhái': 'Phát hiện cửa hàng kinh doanh sản phẩm hàng giả mạo nhãn hiệu nổi tiếng. Sản phẩm có dấu hiệu làm giả bao bì, tem nhãn, chất lượng không đảm bảo.',
      'Gian lận thương mại': 'Phát hiện cửa hàng niêm yết giá không đúng, tăng giá đột biến không có lý do chính đáng. Có dấu hiệu gian lận cân đo đong đếm.',
      'An toàn thực phẩm': 'Phát hiện cơ sở kinh doanh thực phẩm không có giấy phép vệ sinh an toàn thực phẩm. Điều kiện bảo quản không đảm bảo, nguy cơ ảnh hưởng sức khỏe người tiêu dùng.',
      'Vi phạm về giá': 'Cơ sở kinh doanh không niêm yết giá, hoặc bán hàng cao hơn giá niêm yết. Có dấu hiệu thu lợi bất chính từ người tiêu dùng.',
      'Kinh doanh trái phép': 'Phát hiện cơ sở kinh doanh không có giấy phép, hoạt động trái phép tại địa bàn. Cần xử lý nghiêm để đảm bảo trật tự thị trường.',
      'Buôn lậu – Vận chuyển trái phép': 'Phát hiện hành vi vận chuyển hàng hóa không rõ nguồn gốc, có dấu hiệu buôn lậu, trốn thuế. Số lượng lớn, cần kiểm tra ngay.',
      'Thương mại điện tử & Mạng xã hội': 'Tài khoản bán hàng trên nền tảng TMĐT, mạng xã hội quảng cáo sản phẩm không đúng thực tế, có dấu hiệu lừa đảo người tiêu dùng.',
      'Quảng cáo sai phạm': 'Quảng cáo sản phẩm có nội dung phóng đại công dụng, sử dụng hình ảnh gây nhầm lẫn, vi phạm quy định pháp luật về quảng cáo.',
      'Thuốc – Mỹ phẩm – Thiết bị y tế': 'Phát hiện cơ sở bán thuốc, mỹ phẩm, thiết bị y tế không có giấy phép. Sản phẩm không rõ nguồn gốc, nguy cơ cao ảnh hưởng sức khỏe.',
      'Hàng hóa không rõ nguồn gốc': 'Sản phẩm không có tem nhãn phụ tiếng Việt, không có thông tin nguồn gốc xuất xứ rõ ràng. Nghi ngờ hàng nhập lậu, hàng giả.',
      'Vi phạm trong dịp cao điểm': 'Phát hiện vi phạm trong dịp lễ, Tết, các sự kiện đặc biệt. Tình trạng tăng giá, găm hàng, kinh doanh hàng giả tràn lan.',
      'Nghi vấn / Dấu hiệu bất thường': 'Phát hiện dấu hiệu bất thường, nghi ngờ có hành vi vi phạm cần được cơ quan chức năng kiểm tra, xác minh làm rõ.',
    };
    return descriptions[report.chuyen_de] || 'Phát hiện vi phạm cần được kiểm tra và xử lý.';
  };

  if (reports.length === 0) {
    return (
      <div 
        className={`bg-card rounded-lg border border-border overflow-hidden transition-all ${
          isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        style={{ height: '220px', display: 'flex', flexDirection: 'column' }}
      >
        <div className="bg-muted/50 border-b border-border flex items-center justify-between flex-shrink-0" style={{ height: '38px', padding: '0 12px' }}>
          <h3 className="font-semibold text-foreground" style={{ fontSize: '12px' }}>Hình ảnh phản ánh của người dân</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Không có phản ánh phù hợp với bộ lọc</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>Thử điều chỉnh bộ lọc để xem thêm</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`bg-card rounded-lg border border-border overflow-hidden transition-all ${
          isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        style={{ height: '220px', display: 'flex', flexDirection: 'column' }}
      >
        <div className="bg-muted/50 border-b border-border flex items-center justify-between flex-shrink-0" style={{ height: '38px', padding: '0 12px' }}>
          <h3 className="font-semibold text-foreground" style={{ fontSize: '12px' }}>Hình ảnh phản ánh của người dân</h3>
          <span className="text-muted-foreground" style={{ fontSize: '11px' }}>
            {reports.length} phản ánh
          </span>
        </div>

        <div className="flex-1 overflow-auto" style={{ padding: '8px' }}>
          <div className="grid grid-cols-4 gap-2">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="relative aspect-square rounded overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all group"
              >
                <img
                  src={getReportImage(report)}
                  alt={report.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <div className="text-white text-left" style={{ fontSize: '9px', lineHeight: '1.2' }}>
                    <div className="font-medium truncate">{report.chuyen_de}</div>
                    <div className="text-white/70">{formatDateShort(report.created_at)}</div>
                  </div>
                </div>
                <div 
                  className={`absolute top-1 right-1 rounded font-medium ${
                    report.status === 'Đã xác minh'
                      ? 'bg-green-500/90 text-white'
                      : report.status === 'Đang xử lý'
                      ? 'bg-yellow-500/90 text-white'
                      : 'bg-blue-500/90 text-white'
                  }`}
                  style={{ fontSize: '8px', padding: '2px 4px' }}
                >
                  {report.status}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Popup */}
      {selectedReport && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setSelectedReport(null)}
        >
          <div 
            className="bg-card rounded-lg border border-border overflow-hidden max-w-4xl w-full"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-muted/50 border-b border-border flex items-center justify-between" style={{ padding: '14px 16px' }}>
              <h2 className="font-semibold text-foreground" style={{ fontSize: '15px' }}>
                Chi tiết phản ánh
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReport(null)}
                className="hover:bg-muted"
                style={{ height: '32px', width: '32px', padding: 0 }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </Button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-6" style={{ padding: '20px' }}>
              {/* Left: Image Gallery */}
              <div className="space-y-3">
                {/* Main Image with Navigation */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border group">
                  <img
                    src={getReportImages(selectedReport)[currentImageIndex]}
                    alt={selectedReport.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white font-medium rounded" style={{ fontSize: '10px', padding: '4px 8px' }}>
                    MAPPA
                  </div>
                  
                  {/* Image Counter */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white font-medium rounded" style={{ fontSize: '10px', padding: '4px 8px' }}>
                    {currentImageIndex + 1} / {getReportImages(selectedReport).length}
                  </div>

                  {/* Navigation Buttons */}
                  {getReportImages(selectedReport).length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentImageIndex === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 border-white/20 text-white disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ height: '32px', width: '32px' }}
                      >
                        <ChevronLeft style={{ width: '16px', height: '16px' }} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentImageIndex((prev) => Math.min(prev + 1, getReportImages(selectedReport).length - 1))}
                        disabled={currentImageIndex === getReportImages(selectedReport).length - 1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 border-white/20 text-white disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ height: '32px', width: '32px' }}
                      >
                        <ChevronRight style={{ width: '16px', height: '16px' }} />
                      </Button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {getReportImages(selectedReport).length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {getReportImages(selectedReport).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ width: '72px', height: '54px' }}
                      >
                        <img
                          src={img}
                          alt={`Ảnh ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Status Badge */}
                <div 
                  className={`inline-flex items-center rounded font-medium ${
                    selectedReport.status === 'Đã xác minh'
                      ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                      : selectedReport.status === 'Đang xử lý'
                      ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30'
                      : 'bg-blue-500/10 text-blue-600 border border-blue-500/30'
                  }`}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  {selectedReport.status}
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5" style={{ fontSize: '11px' }}>
                    <Tag style={{ width: '13px', height: '13px' }} />
                    <span>Danh mục vi phạm</span>
                  </div>
                  <div className="font-semibold text-foreground" style={{ fontSize: '14px' }}>
                    {selectedReport.chuyen_de}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5" style={{ fontSize: '11px' }}>
                    <FileText style={{ width: '13px', height: '13px' }} />
                    <span>Mô tả chi tiết</span>
                  </div>
                  <div className="text-foreground leading-relaxed" style={{ fontSize: '13px' }}>
                    {getDescription(selectedReport)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5" style={{ fontSize: '11px' }}>
                    <User style={{ width: '13px', height: '13px' }} />
                    <span>Người báo cáo</span>
                  </div>
                  <div className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {getReporterName(selectedReport)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5" style={{ fontSize: '11px' }}>
                    <MapPin style={{ width: '13px', height: '13px' }} />
                    <span>Địa bàn</span>
                  </div>
                  <div className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {selectedReport.dia_ban.ward || selectedReport.dia_ban.district}, {selectedReport.dia_ban.province}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5" style={{ fontSize: '11px' }}>
                    <Calendar style={{ width: '13px', height: '13px' }} />
                    <span>Thời gian</span>
                  </div>
                  <div className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {formatDate(selectedReport.created_at)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5" style={{ fontSize: '11px' }}>
                    <Phone style={{ width: '13px', height: '13px' }} />
                    <span>Liên hệ</span>
                  </div>
                  <div className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {getReporterPhone(selectedReport)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1.5" style={{ fontSize: '11px' }}>
                    <Mail style={{ width: '13px', height: '13px' }} />
                    <span>Email</span>
                  </div>
                  <div className="text-foreground" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {getReporterEmail(selectedReport)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
