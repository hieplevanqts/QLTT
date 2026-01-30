import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileImage, 
  FileVideo, 
  File,
  MoreVertical
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import styles from './EvidenceKanbanBoard.module.css';

// Evidence types
export type EvidenceStatus = 'inbox' | 'review' | 'processed';

export interface KanbanEvidence {
  id: string;
  title: string;
  fileType: 'image' | 'video' | 'document';
  thumbnail?: string;
  uploadedDate: string;
  uploadedTime: string;
  status: EvidenceStatus;
  dueDate: Date; // SLA deadline
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
}

interface EvidenceKanbanBoardProps {
  evidences?: KanbanEvidence[];
  onStatusChange?: (evidenceId: string, newStatus: EvidenceStatus) => void;
  onCardClick?: (evidence: KanbanEvidence) => void;
}

// DND Item Type
const ItemTypes = {
  CARD: 'evidence-card',
};

// Column configuration
const columns: { id: EvidenceStatus; title: string; color: string }[] = [
  { id: 'inbox', title: 'Hộp thư đến / Mới', color: '#3b82f6' },
  { id: 'review', title: 'Đang đánh giá', color: '#f59e0b' },
  { id: 'processed', title: 'Đã xử lý', color: '#22c55e' },
];

// Mock data
const mockEvidences: KanbanEvidence[] = [
  {
    id: 'EV-2026-001',
    title: 'Ảnh hiện trường vi phạm ATVSTP',
    fileType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400',
    uploadedDate: '07/01/2026',
    uploadedTime: '14:30',
    status: 'inbox',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    priority: 'high',
    assignee: 'Nguyễn Văn A',
  },
  {
    id: 'EV-2026-002',
    title: 'Video ghi hình quá trình kiểm tra',
    fileType: 'video',
    uploadedDate: '07/01/2026',
    uploadedTime: '13:15',
    status: 'inbox',
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    priority: 'medium',
    assignee: 'Trần Thị B',
  },
  {
    id: 'EV-2026-003',
    title: 'Biên bản thu thập mẫu thực phẩm',
    fileType: 'document',
    uploadedDate: '07/01/2026',
    uploadedTime: '11:45',
    status: 'inbox',
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
    priority: 'low',
  },
  {
    id: 'EV-2026-004',
    title: 'Ảnh bao bì sản phẩm vi phạm',
    fileType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
    uploadedDate: '06/01/2026',
    uploadedTime: '16:20',
    status: 'review',
    dueDate: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour - urgent
    priority: 'high',
    assignee: 'Lê Văn C',
  },
  {
    id: 'EV-2026-005',
    title: 'Video phỏng vấn nhân chứng',
    fileType: 'video',
    uploadedDate: '06/01/2026',
    uploadedTime: '15:00',
    status: 'review',
    dueDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
    priority: 'medium',
    assignee: 'Phạm Thị D',
  },
  {
    id: 'EV-2026-006',
    title: 'Kết quả xét nghiệm mẫu thực phẩm',
    fileType: 'document',
    uploadedDate: '05/01/2026',
    uploadedTime: '10:30',
    status: 'processed',
    dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // Already processed
    priority: 'high',
    assignee: 'Nguyễn Văn A',
  },
  {
    id: 'EV-2026-007',
    title: 'Ảnh hiện trường sau xử lý',
    fileType: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    uploadedDate: '05/01/2026',
    uploadedTime: '09:15',
    status: 'processed',
    dueDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    priority: 'medium',
    assignee: 'Trần Thị B',
  },
];

// Evidence Card Component
function EvidenceCard({ 
  evidence, 
  onMove, 
  onClick 
}: { 
  evidence: KanbanEvidence; 
  onMove: (id: string, status: EvidenceStatus) => void;
  onClick: (evidence: KanbanEvidence) => void;
}) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  // Calculate time left
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = evidence.dueDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsOverdue(true);
        setTimeLeft('Quá hạn');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }

      setIsOverdue(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [evidence.dueDate]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: evidence.id, currentStatus: evidence.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getFileIcon = () => {
    switch (evidence.fileType) {
      case 'image':
        return <FileImage className={styles.fileIcon} />;
      case 'video':
        return <FileVideo className={styles.fileIcon} />;
      case 'document':
        return <File className={styles.fileIcon} />;
    }
  };

  const getSLAClass = () => {
    if (isOverdue) return styles.slaOverdue;
    
    const now = new Date();
    const diff = evidence.dueDate.getTime() - now.getTime();
    const hoursLeft = diff / (1000 * 60 * 60);

    if (hoursLeft <= 2) return styles.slaUrgent;
    if (hoursLeft <= 6) return styles.slaWarning;
    return styles.slaOk;
  };

  const getPriorityClass = () => {
    switch (evidence.priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  return (
    <div
      ref={drag}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      onClick={() => onClick(evidence)}
    >
      {evidence.priority && (
        <div className={`${styles.priorityBar} ${getPriorityClass()}`} />
      )}
      
      <div className={styles.cardHeader}>
        <div className={styles.cardId}>{evidence.id}</div>
        <button className={styles.cardMenu}>
          <MoreVertical className={styles.menuIcon} />
        </button>
      </div>

      {evidence.thumbnail ? (
        <div className={styles.cardThumbnail}>
          <img src={evidence.thumbnail} alt={evidence.title} className={styles.thumbnailImage} />
          <div className={styles.thumbnailOverlay}>
            {getFileIcon()}
          </div>
        </div>
      ) : (
        <div className={styles.cardPlaceholder}>
          {getFileIcon()}
        </div>
      )}

      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{evidence.title}</div>
        
        <div className={styles.cardMeta}>
          <span className={styles.cardDate}>
            <Clock className={styles.metaIcon} />
            {evidence.uploadedDate}
          </span>
          {evidence.assignee && (
            <span className={styles.cardAssignee}>{evidence.assignee}</span>
          )}
        </div>

        <div className={styles.cardFooter}>
          <Badge className={`${styles.slaBadge} ${getSLAClass()}`}>
            {isOverdue ? <AlertCircle className={styles.badgeIcon} /> : <Clock className={styles.badgeIcon} />}
            {timeLeft}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Column Component
function KanbanColumn({ 
  column, 
  evidences, 
  onDrop,
  onCardClick 
}: { 
  column: typeof columns[0]; 
  evidences: KanbanEvidence[];
  onDrop: (id: string, status: EvidenceStatus) => void;
  onCardClick: (evidence: KanbanEvidence) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: { id: string; currentStatus: EvidenceStatus }) => {
      if (item.currentStatus !== column.id) {
        onDrop(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader} style={{ borderTopColor: column.color }}>
        <div className={styles.columnTitle}>
          <span className={styles.columnDot} style={{ backgroundColor: column.color }} />
          {column.title}
        </div>
        <Badge variant="secondary" className={styles.columnCount}>
          {evidences.length}
        </Badge>
      </div>

      <div 
        ref={drop} 
        className={`${styles.columnContent} ${isOver ? styles.columnContentOver : ''}`}
      >
        {evidences.length === 0 ? (
          <div className={styles.emptyState}>
            <CheckCircle2 className={styles.emptyIcon} />
            <p className={styles.emptyText}>Không có mục nào</p>
          </div>
        ) : (
          evidences.map((evidence) => (
            <EvidenceCard
              key={evidence.id}
              evidence={evidence}
              onMove={onDrop}
              onClick={onCardClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Main Kanban Board Component
export default function EvidenceKanbanBoard({
  evidences = mockEvidences,
  onStatusChange,
  onCardClick,
}: EvidenceKanbanBoardProps) {
  const [items, setItems] = useState<KanbanEvidence[]>(evidences);

  const handleDrop = (id: string, newStatus: EvidenceStatus) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    onStatusChange?.(id, newStatus);
  };

  const handleCardClick = (evidence: KanbanEvidence) => {
    onCardClick?.(evidence);
  };

  // Group evidences by status
  const groupedEvidences = columns.reduce((acc, column) => {
    acc[column.id] = items.filter((item) => item.status === column.id);
    return acc;
  }, {} as Record<EvidenceStatus, KanbanEvidence[]>);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.board}>
        <div className={styles.boardHeader}>
          <div className={styles.boardTitle}>
            <h2 className={styles.title}>Bảng Đánh Giá Chứng Cứ</h2>
            <p className={styles.subtitle}>Kéo thả để thay đổi trạng thái</p>
          </div>
          <div className={styles.boardStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{items.length}</span>
              <span className={styles.statLabel}>Tổng số</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {items.filter(e => {
                  const diff = e.dueDate.getTime() - new Date().getTime();
                  return diff <= 2 * 60 * 60 * 1000 && diff > 0;
                }).length}
              </span>
              <span className={styles.statLabel}>Khẩn cấp</span>
            </div>
          </div>
        </div>

        <div className={styles.boardColumns}>
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              evidences={groupedEvidences[column.id]}
              onDrop={handleDrop}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
