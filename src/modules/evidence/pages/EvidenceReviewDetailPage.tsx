import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  User,
  MapPin,
  Calendar,
  FileText,
  Lock,
  Check,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/layouts/PageHeader';
import { toast } from 'sonner';

interface Evidence {
  id: string;
  fileName: string;
  type: 'image' | 'video' | 'document';
  submittedBy: string;
  submittedAt: string;
  location: string;
  linkedEntity: string;
  entityType: string;
  status: 'inReview' | 'needMoreInfo';
}

interface Comment {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  type: 'comment' | 'request' | 'response';
}

export default function EvidenceReviewDetailPage() {
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const navigate = useNavigate();
  
  const [checklist, setChecklist] = useState({
    qualityClear: false,
    metadataComplete: false,
    locationVerified: false,
    timestampValid: false,
    linkedEntityCorrect: false,
    sensitivityAppropriate: false
  });
  
  const [decision, setDecision] = useState<'approve' | 'reject' | 'needMoreInfo' | null>(null);
  const [comment, setComment] = useState('');
  const [requestInfo, setRequestInfo] = useState('');

  // Mock data
  const evidence: Evidence = {
    id: evidenceId || 'EVD-2026-1252',
    fileName: 'anh_vi_pham_ve_sinh.jpg',
    type: 'image',
    submittedBy: 'Nguyễn Văn A',
    submittedAt: '10/01/2026 09:30',
    location: 'Phường 1, Hà Nội',
    linkedEntity: 'CASE-2026-048',
    entityType: 'Vụ việc',
    status: 'inReview'
  };

  const comments: Comment[] = [
    {
      id: '1',
      author: 'Nguyễn Văn A',
      role: 'Submitter',
      timestamp: '10/01/2026 09:30',
      content: 'Hình ảnh vi phạm vệ sinh tại bếp chế biến, phát hiện côn trùng trong khu vực lưu trữ thực phẩm.',
      type: 'comment'
    },
    {
      id: '2',
      author: 'Lê Văn C',
      role: 'Reviewer',
      timestamp: '10/01/2026 11:20',
      content: 'Cần bổ sung thông tin về vị trí GPS chính xác và thời gian chụp.',
      type: 'request'
    },
    {
      id: '3',
      author: 'Nguyễn Văn A',
      role: 'Submitter',
      timestamp: '10/01/2026 13:45',
      content: 'Đã cập nhật vị trí GPS: 10.7769, 106.7009. Thời gian chụp: 10/01/2026 09:00',
      type: 'response'
    }
  ];

  const handleChecklistChange = (field: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmitReview = () => {
    if (!decision) {
      toast.error('Vui lòng chọn quyết định xét duyệt');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nhận xét');
      return;
    }

    if (decision === 'needMoreInfo' && !requestInfo.trim()) {
      toast.error('Vui lòng mô tả thông tin cần bổ sung');
      return;
    }

    const decisionText = decision === 'approve' ? 'đã duyệt' :
                        decision === 'reject' ? 'từ chối' : 'yêu cầu bổ sung';
    
    toast.success(`Đã ${decisionText} chứng cứ ${evidence.id}`);
    
    setTimeout(() => {
      navigate('/evidence/review');
    }, 1500);
  };

  const allChecksPassed = Object.values(checklist).every(v => v);
  const checksPassed = Object.values(checklist).filter(v => v).length;
  const totalChecks = Object.values(checklist).length;

  return (
    <div style={{ padding: 0, maxWidth: '100%', margin: 0 }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Hàng đợi xét duyệt', href: '/evidence/review' },
          { label: evidence.id }
        ]}
        title={`Xét duyệt: ${evidence.id}`}
        actions={
          <Button variant="outline" onClick={() => navigate('/evidence/review')}>
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        }
      />

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Viewer & Comments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Viewer */}
            <Card>
              <CardContent style={{ padding: '24px' }}>
                {/* Toolbar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {evidence.fileName}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="sm" onClick={() => toast.info('Zoom In')}>
                      <ZoomIn size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.info('Zoom Out')}>
                      <ZoomOut size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.info('Rotate')}>
                      <RotateCw size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.success('Đang tải xuống...')}>
                      <Download size={16} />
                    </Button>
                  </div>
                </div>

                {/* Image viewer */}
                <div style={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '500px',
                  marginBottom: '16px',
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1720213620000-83166fc0af2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGluc3BlY3Rpb258ZW58MXx8fHwxNzY4MDMyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt={evidence.fileName}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '500px',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {/* Evidence info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <User size={16} />
                    <span>{evidence.submittedBy}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <Calendar size={16} />
                    <span>{evidence.submittedAt}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} />
                    <span>{evidence.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <FileText size={16} />
                    <span>{evidence.entityType}: {evidence.linkedEntity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comment Thread */}
            <Card>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Lịch sử trao đổi
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {comments.map((comment) => (
                    <div key={comment.id} style={{
                      padding: '16px',
                      background: comment.role === 'Reviewer' ? '#005cb608' : 'var(--background-secondary)',
                      border: `1px solid ${comment.role === 'Reviewer' ? '#005cb620' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={16} style={{ color: 'var(--text-tertiary)' }} />
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {comment.author}
                          </span>
                          <Badge 
                            variant="outline" 
                            style={{ 
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderColor: comment.role === 'Reviewer' ? '#005cb6' : '#6b7280',
                              color: comment.role === 'Reviewer' ? '#005cb6' : '#6b7280',
                              background: comment.role === 'Reviewer' ? '#005cb610' : 'transparent',
                            }}
                          >
                            {comment.role}
                          </Badge>
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                          {comment.timestamp}
                        </span>
                      </div>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        margin: '0 0 8px 0',
                      }}>
                        {comment.content}
                      </p>
                      {comment.type === 'request' && (
                        <Badge variant="outline" style={{ borderColor: '#f59e0b', color: '#f59e0b', background: '#f59e0b10' }}>
                          <AlertCircle size={12} />
                          Yêu cầu bổ sung
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Review Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '24px' }}>
            
            {/* Checklist */}
            <Card>
              <CardContent style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    Checklist xét duyệt
                  </h3>
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: allChecksPassed ? '#22c55e' : '#f59e0b',
                      color: allChecksPassed ? '#22c55e' : '#f59e0b',
                      background: allChecksPassed ? '#22c55e10' : '#f59e0b10',
                    }}
                  >
                    {checksPassed}/{totalChecks}
                  </Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { key: 'qualityClear', label: 'Chất lượng hình ảnh/video rõ ràng, đủ điều kiện làm chứng cứ' },
                    { key: 'metadataComplete', label: 'Metadata đầy đủ và chính xác' },
                    { key: 'locationVerified', label: 'Vị trí GPS đã được xác minh' },
                    { key: 'timestampValid', label: 'Timestamp hợp lý và có thể xác thực' },
                    { key: 'linkedEntityCorrect', label: 'Liên kết vụ việc/nhiệm vụ chính xác' },
                    { key: 'sensitivityAppropriate', label: 'Nhãn bảo mật phù hợp với nội dung' },
                  ].map((item) => (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      <Checkbox
                        id={item.key}
                        checked={checklist[item.key as keyof typeof checklist]}
                        onCheckedChange={() => handleChecklistChange(item.key as keyof typeof checklist)}
                      />
                      <Label 
                        htmlFor={item.key} 
                        style={{ 
                          cursor: 'pointer', 
                          fontSize: 'var(--text-sm)',
                          lineHeight: '1.5',
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {allChecksPassed && (
                  <div style={{
                    padding: '12px',
                    background: '#22c55e10',
                    border: '1px solid #22c55e',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#22c55e',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                  }}>
                    <CheckCircle size={16} />
                    <span>Tất cả kiểm tra đã hoàn thành</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Decision Panel */}
            <Card>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  Quyết định xét duyệt
                </h3>

                {/* Decision buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setDecision('approve')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: decision === 'approve' ? '#22c55e15' : 'var(--background-secondary)',
                      border: `2px solid ${decision === 'approve' ? '#22c55e' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: decision === 'approve' ? '#22c55e' : 'var(--text-primary)',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: decision === 'approve' ? '#22c55e' : 'var(--background)',
                      borderRadius: '50%',
                      color: decision === 'approve' ? 'white' : '#22c55e',
                    }}>
                      <CheckCircle size={20} />
                    </div>
                    <span>Phê duyệt</span>
                  </button>

                  <button
                    onClick={() => setDecision('needMoreInfo')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: decision === 'needMoreInfo' ? '#f59e0b15' : 'var(--background-secondary)',
                      border: `2px solid ${decision === 'needMoreInfo' ? '#f59e0b' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: decision === 'needMoreInfo' ? '#f59e0b' : 'var(--text-primary)',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: decision === 'needMoreInfo' ? '#f59e0b' : 'var(--background)',
                      borderRadius: '50%',
                      color: decision === 'needMoreInfo' ? 'white' : '#f59e0b',
                    }}>
                      <AlertCircle size={20} />
                    </div>
                    <span>Cần bổ sung</span>
                  </button>

                  <button
                    onClick={() => setDecision('reject')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: decision === 'reject' ? '#ef444415' : 'var(--background-secondary)',
                      border: `2px solid ${decision === 'reject' ? '#ef4444' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: decision === 'reject' ? '#ef4444' : 'var(--text-primary)',
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: decision === 'reject' ? '#ef4444' : 'var(--background)',
                      borderRadius: '50%',
                      color: decision === 'reject' ? 'white' : '#ef4444',
                    }}>
                      <XCircle size={20} />
                    </div>
                    <span>Từ chối</span>
                  </button>
                </div>

                {/* Request info field for "needMoreInfo" */}
                {decision === 'needMoreInfo' && (
                  <div style={{ marginBottom: '20px' }}>
                    <Label htmlFor="requestInfo" style={{ marginBottom: '8px', display: 'block' }}>
                      Yêu cầu bổ sung thông tin <span style={{ color: '#ef4444' }}>*</span>
                    </Label>
                    <Textarea
                      id="requestInfo"
                      value={requestInfo}
                      onChange={(e) => setRequestInfo(e.target.value)}
                      placeholder="Mô tả chi tiết thông tin cần bổ sung..."
                      rows={3}
                    />
                  </div>
                )}

                {/* Comment field */}
                <div style={{ marginBottom: '20px' }}>
                  <Label htmlFor="comment" style={{ marginBottom: '8px', display: 'block' }}>
                    Nhận xét <span style={{ color: '#ef4444' }}>*</span>
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập nhận xét của bạn về chứng cứ này..."
                    rows={4}
                  />
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/evidence/review')}
                    style={{ flex: 1 }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={!decision || !comment.trim()}
                    style={{ flex: 1 }}
                  >
                    <Send size={16} />
                    Gửi quyết định
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seal Section */}
            <Card>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 12px 0',
                }}>
                  Niêm phong chứng cứ
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  margin: '0 0 16px 0',
                }}>
                  Niêm phong chứng cứ sau khi phê duyệt để đảm bảo tính toàn vẹn. 
                  Chứng cứ đã niêm phong không thể chỉnh sửa.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={decision !== 'approve'}
                  style={{ width: '100%' }}
                >
                  <Lock size={14} />
                  Niêm phong sau khi duyệt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

