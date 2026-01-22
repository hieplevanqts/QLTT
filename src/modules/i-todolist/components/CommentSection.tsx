import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import type { Comment } from '../types';
import { commentService } from '../services/taskService';
import { Button } from '@/app/components/ui/button';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  taskId: string;
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    const data = await commentService.getCommentsByTaskId(taskId);
    setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      await commentService.addComment(taskId, newComment.trim());
      setNewComment('');
      await loadComments();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    await commentService.deleteComment(commentId);
    await loadComments();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Bình luận ({comments.length})</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
          className={styles.textarea}
          rows={3}
          disabled={loading}
        />
        <div className={styles.formActions}>
          <Button type="submit" size="sm" disabled={!newComment.trim() || loading}>
            <Send className="h-4 w-4" />
            Gửi
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className={styles.list}>
        {comments.length === 0 ? (
          <div className={styles.empty}>Chưa có bình luận nào</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.author}>{comment.author}</span>
                <span className={styles.time}>{formatDate(comment.createdAt)}</span>
              </div>
              <div className={styles.commentContent}>{comment.content}</div>
              <button
                onClick={() => handleDelete(comment.id)}
                className={styles.deleteButton}
                title="Xóa bình luận"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}