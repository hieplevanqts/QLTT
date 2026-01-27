import { Plus, Folder, LayoutGrid } from 'lucide-react';
import type { Topic } from '../types';
import styles from './TopicsPanel.module.css';

interface TopicsPanelProps {
  topics: Topic[];
  selectedTopicId: string | null;
  onTopicSelect: (topicId: string | null) => void;
  onCreateTopic: () => void;
  totalTaskCount: number;
}

export function TopicsPanel({
  topics,
  selectedTopicId,
  onTopicSelect,
  onCreateTopic,
  totalTaskCount,
}: TopicsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span>Chủ đề / Phiên</span>
          <button className={styles.layoutButton} aria-label="Cài đặt">
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.createButton} onClick={onCreateTopic}>
          <Plus size={16} />
          Tạo chủ đề mới
        </button>
      </div>

      <div className={styles.list}>
        <button
          className={`${styles.topicItem} ${
            selectedTopicId === null ? styles.active : ''
          }`}
          onClick={() => onTopicSelect(null)}
        >
          <Folder size={16} className={styles.topicIcon} />
          <div className={styles.topicContent}>
            <span className={styles.topicName}>Tất cả nhiệm vụ</span>
          </div>
          <span className={styles.count}>{totalTaskCount}</span>
        </button>

        {topics.map((topic) => (
          <button
            key={topic.id}
            className={`${styles.topicItem} ${
              selectedTopicId === topic.id ? styles.active : ''
            }`}
            onClick={() => onTopicSelect(topic.id)}
          >
            <div
              className={styles.colorDot}
              style={{ backgroundColor: topic.color }}
            />
            <div className={styles.topicContent}>
              <span className={styles.topicName}>{topic.name}</span>
            </div>
            <span className={styles.count}>{topic.taskCount}</span>
          </button>
        ))}
      </div>
    </div>
  );
}