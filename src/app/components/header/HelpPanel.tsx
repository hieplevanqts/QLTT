import React, { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink, X, Video, FileText, Headphones } from 'lucide-react';
import { FeedbackDialog } from './FeedbackDialog';
import styles from './HelpPanel.module.css';

interface HelpPanelProps {
  onClose: () => void;
}

const QUICK_HELP_ITEMS = [
  { id: '1', title: 'Hướng dẫn tạo kế hoạch kiểm tra', category: 'Kế hoạch' },
  { id: '2', title: 'Cách ghi nhận chứng cứ vi phạm', category: 'Chứng cứ' },
  { id: '3', title: 'Quy trình tạo hồ sơ pháp lý', category: 'Hồ sơ pháp lý' },
  { id: '4', title: 'Hướng dẫn sử dụng bản đồ', category: 'Bản đồ' },
];

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'Làm sao để thêm cơ sở mới?',
    answer: 'Vào menu Cơ sở & Địa bàn, nhấn nút "Thêm cơ sở" và điền đầy đủ thông tin.',
  },
  {
    id: '2',
    question: 'Tôi quên mật khẩu, phải làm sao?',
    answer: 'Nhấn "Quên mật khẩu" ở trang đăng nhập và làm theo hướng dẫn.',
  },
  {
    id: '3',
    question: 'Làm sao để xuất báo cáo?',
    answer: 'Vào trang báo cáo tương ứng và nhấn nút "Xuất Excel" hoặc "Xuất PDF".',
  },
];

export function HelpPanel({ onClose }: HelpPanelProps) {
  const [isFeedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const openFeedbackDialog = () => {
    setFeedbackDialogOpen(true);
  };

  const closeFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <HelpCircle size={20} />
          <h3 className={styles.panelTitle}>Trợ giúp</h3>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.panelContent}>
        {/* Quick Help */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Book size={18} />
            <h4 className={styles.sectionTitle}>Hướng dẫn nhanh</h4>
          </div>
          <div className={styles.helpList}>
            {QUICK_HELP_ITEMS.map((item) => (
              <a key={item.id} href="#" className={styles.helpItem}>
                <div className={styles.helpItemContent}>
                  <div className={styles.helpItemTitle}>{item.title}</div>
                  <div className={styles.helpItemCategory}>{item.category}</div>
                </div>
                <ExternalLink size={16} className={styles.helpItemIcon} />
              </a>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <MessageCircle size={18} />
            <h4 className={styles.sectionTitle}>Câu hỏi thường gặp</h4>
          </div>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <details key={item.id} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.question}</summary>
                <div className={styles.faqAnswer}>{item.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Mail size={18} />
            <h4 className={styles.sectionTitle}>Liên hệ hỗ trợ</h4>
          </div>
          <div className={styles.contactInfo}>
            <p className={styles.contactText}>
              Email: <a href="mailto:support@mappa.gov.vn" className={styles.contactLink}>support@mappa.gov.vn</a>
            </p>
            <p className={styles.contactText}>
              Hotline: <a href="tel:1900xxxx" className={styles.contactLink}>1900 xxxx</a>
            </p>
            <p className={styles.contactSubtext}>
              Thời gian hỗ trợ: 8:00 - 17:00 (Th��� 2 - Thứ 6)
            </p>
          </div>
        </section>
      </div>

      <div className={styles.panelFooter}>
        <button className={styles.feedbackButton} onClick={openFeedbackDialog}>
          <MessageCircle size={16} />
          Gửi phản hồi
        </button>
      </div>

      <FeedbackDialog isOpen={isFeedbackDialogOpen} onClose={closeFeedbackDialog} />
    </div>
  );
}