import { useState } from 'react';
import { Plus, Folder, Minimize2 } from 'lucide-react';
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
        <h2 className={styles.title}>Chủ đề / Phiên</h2>
        <button className={styles.toggleButton} aria-label="Thu gọn">
          <Minimize2 size={18} />
        </button>
      </div>

      <button className={styles.createButton} onClick={onCreateTopic}>
        <Plus size={18} />
        Tạo chủ đề mới
      </button>

      <div className={styles.topicsList}>
        <button
          className={`${styles.allTasksItem} ${
            selectedTopicId === null ? styles.active : ''
          }`}
          onClick={() => onTopicSelect(null)}
        >
          <Folder size={16} className={styles.folderIcon} />
          <div className={styles.topicContent}>
            <div className={styles.topicName}>Tất cả nhiệm vụ</div>
          </div>
          <div className={styles.topicCount}>{totalTaskCount}</div>
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
              className={styles.colorIndicator}
              style={{ backgroundColor: topic.color }}
            />
            <div className={styles.topicContent}>
              <div className={styles.topicName}>{topic.name}</div>
            </div>
            <div className={styles.topicCount}>{topic.taskCount}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
