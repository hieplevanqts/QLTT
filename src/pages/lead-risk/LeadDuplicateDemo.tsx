import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { Breadcrumb } from '@/app/components/Breadcrumb';
import { AIDuplicateAlert } from '@/app/components/lead-risk/AIDuplicateAlert';
import { AISimilarLeadsList } from '@/app/components/lead-risk/AISimilarLeadsList';
import styles from './LeadDuplicateDemo.module.css';

export default function LeadDuplicateDemo() {
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Mock data - Current lead
  const currentLead = {
    code: 'LD-2025-001',
    title: 'Cửa hàng mỹ phẩm Hoàn Kiếm bán hàng giả',
    content:
      'Em mua mỹ phẩm ở cửa hàng 45 Hoàn Kiếm, nghi ngờ hàng giả vì giá rẻ hơn nhiều so với cửa hàng chính hãng. Em đã quét mã QR trên tem chống giả nhưng không có phản hồi. Nhân viên cửa hàng nói là hàng xách tay Hàn Quốc nên giá rẻ.',
    reporter: 'Nguyễn Thị Lan Anh',
    phone: '0912345678',
    address: 'Cửa hàng Mỹ phẩm Hàn Quốc - 45 Phố Hàng Gai, Hoàn Kiếm',
    createdAt: '2025-01-22 09:30',
  };

  // Mock data - Similar leads
  const similarLeads = [
    {
      id: '1',
      code: 'LD-2024-156',
      title: 'Cửa hàng mỹ phẩm 45 Hàng Gai bán hàng giả',
      similarity: 94,
      reasons: [
        'Địa chỉ trùng khớp 100%: "45 Phố Hàng Gai, Hoàn Kiếm"',
        'Nội dung mô tả tương tự 92%: Cùng phản ánh về mỹ phẩm giả, tem chống giả không quét được',
        'Hình ảnh sản phẩm giống 85%: Cùng thương hiệu L\'Oreal, MAC',
        'Khoảng cách thời gian: 2 tháng (nghi ngờ tái phạm)',
      ],
      status: 'completed',
      createdAt: '2024-11-15 14:20',
      reporter: 'Trần Văn B',
      content:
        'Shop mỹ phẩm ở số 45 Hàng Gai bán hàng giả, mình mua son MAC nhưng dùng thấy khác hàng thật. Quét tem không được.',
    },
    {
      id: '2',
      code: 'LD-2024-089',
      title: 'Phản ánh cửa hàng mỹ phẩm Hoàn Kiếm',
      similarity: 78,
      reasons: [
        'Địa chỉ gần kề: "47 Phố Hàng Gai, Hoàn Kiếm" (cách 2 số nhà)',
        'Loại vi phạm giống nhau: Hàng giả mỹ phẩm',
        'Cùng khu vực hotspot: Phố Hàng Gai là khu vực có nhiều vi phạm mỹ phẩm',
      ],
      status: 'in-progress',
      createdAt: '2024-08-10 10:15',
      reporter: 'Lê Thị C',
      content:
        'Cửa hàng số 47 Hàng Gai bán mỹ phẩm rẻ bất thường, nghi vấn hàng giả.',
    },
    {
      id: '3',
      code: 'LD-2025-005',
      title: 'Mua mỹ phẩm giả ở Hoàn Kiếm',
      similarity: 65,
      reasons: [
        'Cùng quận: Hoàn Kiếm',
        'Cùng loại sản phẩm: Mỹ phẩm Hàn Quốc',
        'Hình ảnh tem chống giả tương tự 70%',
      ],
      status: 'new',
      createdAt: '2025-01-20 16:45',
      reporter: 'Phạm Thị D',
      content:
        'Mình mua mỹ phẩm Hàn Quốc ở Hoàn Kiếm, tem chống giả không quét được.',
    },
  ];

  const handleViewDetail = (id: string) => {
    alert(`Xem chi tiết nguồn tin: ${id}`);
  };

  const handleCompare = (id: string) => {
    setSelectedLeadId(id);
    setShowComparison(true);
  };

  const handleMerge = (id: string) => {
    if (
      confirm(
        `Bạn có chắc muốn GỘP nguồn tin ${id} vào nguồn tin hiện tại?\n\nHành động này không thể hoàn tác.`
      )
    ) {
      alert(`✅ Đã gộp nguồn tin ${id}`);
    }
  };

  const handleLink = (id: string) => {
    alert(`🔗 Đã liên kết nguồn tin ${id} để tham chiếu`);
  };

  const handleMarkNotDuplicate = (id: string) => {
    if (
      confirm(
        `Đánh dấu nguồn tin ${id} KHÔNG TRÙNG?\n\nAI sẽ không gợi ý nguồn tin này nữa.`
      )
    ) {
      alert(`✅ Đã đánh dấu ${id} không trùng`);
    }
  };

  const selectedLead = similarLeads.find((l) => l.id === selectedLeadId);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Nguồn tin, Rủi ro', path: '/lead-risk/inbox' },
          { label: 'Phát hiện trùng' },
        ]}
      />

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            {currentLead.code}: {currentLead.title}
          </h1>
          <p className={styles.subtitle}>AI tự động phát hiện nguồn tin trùng lặp</p>
        </div>
      </div>

      {/* AI Duplicate Alert */}
      <AIDuplicateAlert
        duplicateCount={similarLeads.length}
        highestSimilarity={similarLeads[0]?.similarity || 0}
        onViewDetails={() => {
          const element = document.getElementById('similar-leads-list');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        onDismiss={() => {
          console.log('Alert dismissed');
        }}
      />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left: Current Lead Info */}
        <div className={styles.currentLeadSection}>
          <h2 className={styles.sectionTitle}>📄 Nguồn tin hiện tại</h2>

          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Mã nguồn tin:</span>
              <span className={styles.infoValue}>{currentLead.code}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Tiêu đề:</span>
              <span className={styles.infoValue}>{currentLead.title}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Người báo:</span>
              <span className={styles.infoValue}>{currentLead.reporter}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Điện thoại:</span>
              <span className={styles.infoValue}>{currentLead.phone}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Địa chỉ vi phạm:</span>
              <span className={styles.infoValue}>{currentLead.address}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Thời gian:</span>
              <span className={styles.infoValue}>{currentLead.createdAt}</span>
            </div>
          </div>

          <div className={styles.contentCard}>
            <h3 className={styles.contentTitle}>Nội dung phản ánh:</h3>
            <p className={styles.contentText}>{currentLead.content}</p>
          </div>
        </div>

        {/* Right: Similar Leads */}
        <div className={styles.similarLeadsSection} id="similar-leads-list">
          <AISimilarLeadsList
            leads={similarLeads}
            onViewDetail={handleViewDetail}
            onCompare={handleCompare}
            onMerge={handleMerge}
            onLink={handleLink}
            onMarkNotDuplicate={handleMarkNotDuplicate}
          />
        </div>
      </div>

      {/* Comparison Modal */}
      {showComparison && selectedLead && (
        <div className={styles.modal} onClick={() => setShowComparison(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>⚖️ So sánh nguồn tin</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowComparison(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.comparisonGrid}>
              {/* Left: Current Lead */}
              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonHeader}>
                  <h3>Nguồn tin hiện tại</h3>
                  <span className={styles.comparisonCode}>{currentLead.code}</span>
                </div>
                <div className={styles.comparisonContent}>
                  <div className={styles.comparisonRow}>
                    <strong>Tiêu đề:</strong>
                    <p>{currentLead.title}</p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Địa chỉ:</strong>
                    <p>{currentLead.address}</p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Người báo:</strong>
                    <p>{currentLead.reporter}</p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Thời gian:</strong>
                    <p>{currentLead.createdAt}</p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Nội dung:</strong>
                    <p>{currentLead.content}</p>
                  </div>
                </div>
              </div>

              {/* Middle: Similarity Info */}
              <div className={styles.similarityInfo}>
                <div className={styles.similarityCircle}>
                  <span className={styles.similarityNumber}>
                    {selectedLead.similarity}%
                  </span>
                  <span className={styles.similarityText}>Tương đồng</span>
                </div>
                <div className={styles.similarityReasons}>
                  <strong>Lý do AI phát hiện:</strong>
                  <ul>
                    {selectedLead.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Selected Lead */}
              <div className={styles.comparisonColumn}>
                <div className={styles.comparisonHeader}>
                  <h3>Nguồn tin tương tự</h3>
                  <span className={styles.comparisonCode}>{selectedLead.code}</span>
                </div>
                <div className={styles.comparisonContent}>
                  <div className={styles.comparisonRow}>
                    <strong>Tiêu đề:</strong>
                    <p>{selectedLead.title}</p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Địa chỉ:</strong>
                    <p>
                      {selectedLead.id === '1'
                        ? '45 Phố Hàng Gai, Hoàn Kiếm'
                        : selectedLead.id === '2'
                        ? '47 Phố Hàng Gai, Hoàn Kiếm'
                        : 'Phố Hàng Bạc, Hoàn Kiếm'}
                    </p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Người báo:</strong>
                    <p>{selectedLead.reporter}</p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Thời gian:</strong>
                    <p>{selectedLead.createdAt}</p>
                  </div>
                  <div className={styles.comparisonRow}>
                    <strong>Nội dung:</strong>
                    <p>{selectedLead.content}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalActionBtn}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
                onClick={() => {
                  handleMerge(selectedLead.id);
                  setShowComparison(false);
                }}
              >
                Gộp nguồn tin
              </button>
              <button
                className={styles.modalActionBtn}
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => {
                  handleLink(selectedLead.id);
                  setShowComparison(false);
                }}
              >
                Liên kết tham chiếu
              </button>
              <button
                className={styles.modalActionBtn}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => setShowComparison(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Design Notes */}
      <div className={styles.designNotes}>
        <h3>✨ Nguyên tắc thiết kế AI Duplicate Detection</h3>
        <ul>
          <li>
            <strong>🔍 AI hoạt động nền:</strong> Tự động so sánh nguồn tin mới với dữ
            liệu hiện có, không cần user kích hoạt
          </li>
          <li>
            <strong>⚠️ Cảnh báo thông minh:</strong> Chỉ hiển thị khi mức độ tương đồng
            {'>'}70%, tránh làm phiền user
          </li>
          <li>
            <strong>📊 So sánh nhanh:</strong> User quét nhanh % tương đồng + lý do →
            Quyết định ngay
          </li>
          <li>
            <strong>⚖️ Side-by-side comparison:</strong> So sánh trực quan 2 nguồn tin,
            không cần đọc lại toàn bộ
          </li>
          <li>
            <strong>✅ 3 hành động rõ ràng:</strong> Gộp / Liên kết / Đánh dấu không
            trùng - User quyết định cuối cùng
          </li>
          <li>
            <strong>🎯 Không tự động:</strong> AI chỉ đề xuất, không tự gộp hay thay đổi
            trạng thái
          </li>
        </ul>
      </div>
    </div>
  );
}