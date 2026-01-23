import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Building2,
  Calendar,
  User,
  FileText,
  MapPin,
  Layers,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Circle,
  Eye,
  Edit,
  Target,
  AlertCircle,
  TrendingUp,
  Send,
  XCircle,
  PlayCircle,
  PauseCircle,
  Trash2
} from 'lucide-react';
import styles from './PlanDetail.module.css';
import { KeHoachTacNghiepStatusBadge } from '../../components/plans/KeHoachTacNghiepStatusBadge';
import { 
  mockPlans, 
  mockMerchants, 
  mockInspectionRounds, 
  mockInspectionSessions, 
  mockHistoryEvents 
} from '../../data/kehoach-mock-data';
import {
  SendForApprovalModal,
  ApproveModal,
  RejectModal,
  RecallModal,
  DeployModal,
  PauseModal,
  DeletePlanModal
} from '../../components/plans/PlanActionModals';
import { toast } from 'sonner';

type TabType = 'info' | 'scope' | 'inspections' | 'sessions' | 'history';

export function PlanDetail() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  // Modal states
  const [modalState, setModalState] = useState<{
    type: 'sendApproval' | 'approve' | 'reject' | 'recall' | 'deploy' | 'pause' | 'delete' | null;
    plan: typeof mockPlans[0] | null;
  }>({ type: null, plan: null });

  const closeModal = () => setModalState({ type: null, plan: null });
  const openModal = (type: typeof modalState.type, planData: typeof mockPlans[0]) => 
    setModalState({ type, plan: planData });

  // Decode planId since it's URL encoded
  const decodedPlanId = planId ? decodeURIComponent(planId) : undefined;
  const plan = mockPlans.find((p) => p.id === decodedPlanId);
  
  // Calculate counts for tabs
  const inspectionRoundsCount = mockInspectionRounds?.filter(r => r.planId === decodedPlanId).length || 0;
  const inspectionSessionsCount = mockInspectionSessions?.filter(s => s.planId === decodedPlanId).length || 0;
  
  // Dynamic tabs with badges
  const TABS_DYNAMIC = [
    { id: 'info' as TabType, label: 'Thông tin chung' },
    { id: 'scope' as TabType, label: 'Khu vực & Đối tượng' },
    { id: 'inspections' as TabType, label: 'Đợt kiểm tra', badge: inspectionRoundsCount },
    { id: 'sessions' as TabType, label: 'Phiên kiểm tra', badge: inspectionSessionsCount },
    { id: 'history' as TabType, label: 'Lịch sử' }
  ];

  if (!plan) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>Không tìm thấy kế hoạch</h3>
          <button className={styles.primaryButton} onClick={() => navigate('/plans')}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()} - ${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear()}`;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={() => navigate('/plans')}>
            <ArrowLeft size={20} />
          </button>

          <div className={styles.headerTitle}>
            <div className={styles.headerTitleRow}>
              <span className={styles.planId}>{plan.id}</span>
              <KeHoachTacNghiepStatusBadge type="plan" value={plan.status} size="sm" />
            </div>
            <h1 className={styles.pageTitle}>{plan.name}</h1>
          </div>

          <div className={styles.headerActions}>
            {/* Draft status actions */}
            {plan.status === 'draft' && (
              <>
                <button 
                  className={styles.outlineButton}
                  onClick={() => {
                    navigate(`/plans/${encodeURIComponent(plan.id)}/edit`);
                  }}
                >
                  <Edit size={18} />
                  Chỉnh sửa
                </button>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('sendApproval', plan)}
                >
                  <Send size={18} />
                  Trình duyệt
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => openModal('delete', plan)}
                  title="Xóa kế hoạch"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}

            {/* Pending approval status actions */}
            {plan.status === 'pending_approval' && (
              <>
                <button 
                  className={styles.outlineButton}
                  onClick={() => openModal('recall', plan)}
                >
                  <XCircle size={18} />
                  Thu hồi
                </button>
                <button 
                  className={styles.outlineButton}
                  onClick={() => openModal('reject', plan)}
                >
                  <XCircle size={18} />
                  Từ chối
                </button>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('approve', plan)}
                >
                  <CheckCircle2 size={18} />
                  Phê duyệt
                </button>
              </>
            )}

            {/* Approved status actions */}
            {plan.status === 'approved' && (
              <>
                <button 
                  className={styles.primaryButton}
                  onClick={() => openModal('deploy', plan)}
                >
                  <PlayCircle size={18} />
                  Triển khai
                </button>
              </>
            )}

            {/* In progress status actions */}
            {plan.status === 'in_progress' && (
              <>
                <button 
                  className={styles.warningButton}
                  onClick={() => openModal('pause', plan)}
                >
                  <PauseCircle size={18} />
                  Tạm dừng
                </button>
              </>
            )}

            {/* Export button - available for all statuses */}
            <button className={styles.outlineButton}>
              <Download size={18} />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS_DYNAMIC.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.badge !== undefined && <span className={styles.tabBadge}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'info' && (
          <div className={styles.infoContent}>
            <h2 className={styles.sectionTitle}>Thông tin chung</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <div className={styles.infoLabel}>Mã kế hoạch</div>
                <div className={styles.infoValue}>
                  <FileText size={16} className={styles.infoIcon} />
                  {plan.id}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.infoLabel}>Quý/Năm</div>
                <div className={styles.infoValue}>
                  <Calendar size={16} className={styles.infoIcon} />
                  {plan.quarter}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.infoLabel}>Đơn vị chịu trách nhiệm</div>
                <div className={styles.infoValue}>
                  <Building2 size={16} className={styles.infoIcon} />
                  {plan.responsibleUnit}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.infoLabel}>Người lập kế hoạch</div>
                <div className={styles.infoValue}>
                  <User size={16} className={styles.infoIcon} />
                  {plan.createdBy}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.infoLabel}>Khu vực kiểm tra</div>
                <div className={styles.infoValue}>
                  <MapPin size={16} className={styles.infoIcon} />
                  {plan.scopeLocation}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.infoLabel}>Ưu tiên</div>
                <div className={styles.infoValue}>
                  <KeHoachTacNghiepStatusBadge type="priority" value={plan.priority} size="sm" />
                </div>
              </div>

              <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                <div className={styles.infoLabel}>Chủ đề kiểm tra</div>
                <div className={styles.infoValue}>{plan.topic}</div>
              </div>

              <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                <div className={styles.infoLabel}>Mục tiêu</div>
                <div className={styles.infoValue}>{plan.objective}</div>
              </div>

              <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                <div className={styles.infoLabel}>Yêu cầu thực hiện</div>
                <ul className={styles.requirementsList}>
                  {plan.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  )) || <li>Không có yêu cầu cụ thể</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scope' && (() => {
          const merchants = mockMerchants?.filter(m => m.planId === decodedPlanId) || [];
          
          return (
            <div className={styles.scopeContent}>
              <div className={styles.scopeSection}>
                <h2 className={styles.scopeSectionTitle}>Khu vực kiểm tra</h2>
                <div className={styles.scopeLocation}>
                  <MapPin size={20} className={styles.scopeIcon} />
                  <div>
                    <div className={styles.scopeLocationTitle}>{plan.scopeLocation}</div>
                    <div className={styles.scopeLocationDesc}>
                      Bao gồm tất cả các cơ sở kinh doanh trong khu vực
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.scopeSection}>
                <div className={styles.scopeHeader}>
                  <div>
                    <h2 className={styles.scopeSectionTitle}>Đối tượng kiểm tra</h2>
                    <div className={styles.scopeCount}>
                      Tổng {merchants.length} cơ sở
                    </div>
                  </div>
                  <button className={styles.primaryButton}>
                    <Plus size={18} />
                    Thêm đối tượng
                  </button>
                </div>

                {merchants.length > 0 ? (
                  <div className={styles.merchantTable}>
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên cơ sở</th>
                          <th>Địa chỉ</th>
                          <th>Ngành hàng</th>
                          <th>Loại hình</th>
                        </tr>
                      </thead>
                      <tbody>
                        {merchants.map((merchant, index) => (
                          <tr key={merchant.id}>
                            <td>{index + 1}</td>
                            <td>{merchant.name}</td>
                            <td>{merchant.address}</td>
                            <td>
                              <span className={styles.industryBadge} style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: 'rgb(59, 130, 246)'
                              }}>
                                {merchant.industry}
                              </span>
                            </td>
                            <td>{merchant.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles.emptyTabContent}>
                    <p>Chưa có đối tượng kiểm tra</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {activeTab === 'inspections' && (() => {
          const inspectionRounds = mockInspectionRounds?.filter(r => r.planId === decodedPlanId) || [];
          
          return (
            <div className={styles.inspectionsTableWrapper}>
              <div className={styles.tableHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Danh sách đợt kiểm tra</h2>
                  <p className={styles.sectionDesc}>
                    Tổng {inspectionRounds.length} đợt kiểm tra
                  </p>
                </div>
                <button className={styles.primaryButton}>
                  <Plus size={18} />
                  Tạo đợt mới
                </button>
              </div>

              {inspectionRounds.length > 0 ? (
                <>
                  <div className={styles.roundsTable}>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>STT</th>
                          <th style={{ width: '140px' }}>Mã đợt</th>
                          <th>Tên đợt kiểm tra</th>
                          <th style={{ width: '140px' }}>Loại hình</th>
                          <th style={{ width: '120px' }}>Trạng thái</th>
                          <th style={{ width: '200px' }}>Thời gian</th>
                          <th style={{ width: '180px' }}>Đơn vị thực hiện</th>
                          <th style={{ width: '100px' }}>Thành viên</th>
                          <th style={{ width: '120px' }}>Tiến độ</th>
                          <th style={{ width: '100px' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inspectionRounds.map((round, index) => (
                          <tr key={round.id}>
                            <td className={styles.textCenter}>{index + 1}</td>
                            <td>
                              <span className={styles.roundCode}>{round.code}</span>
                            </td>
                            <td>
                              <span className={styles.roundName}>{round.name}</span>
                              {round.notes && (
                                <div className={styles.roundNotes}>{round.notes}</div>
                              )}
                            </td>
                            <td>
                              <span className={`${styles.typeBadge} ${styles[`type_${round.type}`]}`}>
                                {round.type === 'scheduled' && 'Theo kế hoạch'}
                                {round.type === 'unannounced' && 'Đột xuất'}
                                {round.type === 'followup' && 'Tái kiểm tra'}
                                {round.type === 'complaint' && 'Theo khiếu nại'}
                              </span>
                            </td>
                            <td>
                              <span className={`${styles.statusBadge} ${styles[`status_${round.status}`]}`}>
                                {round.status === 'draft' && 'Nháp'}
                                {round.status === 'preparing' && 'Chuẩn bị'}
                                {round.status === 'in_progress' && 'Đang kiểm tra'}
                                {round.status === 'reporting' && 'Báo cáo'}
                                {round.status === 'completed' && 'Hoàn thành'}
                                {round.status === 'cancelled' && 'Đã hủy'}
                              </span>
                            </td>
                            <td>
                              <div className={styles.dateRange}>
                                <div className={styles.dateItem}>
                                  {new Date(round.startDate).toLocaleDateString('vi-VN')}
                                </div>
                                <div className={styles.dateSeparator}>→</div>
                                <div className={styles.dateItem}>
                                  {new Date(round.endDate).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className={styles.unitName}>{round.leadUnit}</div>
                            </td>
                            <td className={styles.textCenter}>
                              <span className={styles.memberCount}>
                                {round.teamSize > 0 ? (
                                  <>{round.teamSize} người</>
                                ) : (
                                  <span className={styles.noTeam}>Chưa phân công</span>
                                )}
                              </span>
                            </td>
                            <td>
                              {round.totalTargets > 0 ? (
                                <div className={styles.progressCell}>
                                  <div className={styles.progressText}>
                                    {round.inspectedTargets}/{round.totalTargets}
                                  </div>
                                  <div className={styles.progressBar}>
                                    <div 
                                      className={styles.progressFill}
                                      style={{ 
                                        width: `${(round.inspectedTargets / round.totalTargets) * 100}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className={styles.noData}>-</span>
                              )}
                            </td>
                            <td>
                              <div className={styles.actionCell}>
                                <button 
                                  className={styles.iconButton} 
                                  title="Xem chi tiết"
                                  onClick={() => {
                                    toast.info(`Xem chi tiết đợt ${round.code}`);
                                  }}
                                >
                                  <Eye size={16} />
                                </button>
                                {round.status === 'draft' && (
                                  <button 
                                    className={styles.iconButton} 
                                    title="Chỉnh sửa"
                                    onClick={() => {
                                      toast.info(`Chỉnh sửa đợt ${round.code}`);
                                    }}
                                  >
                                    <Edit size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Table Footer with Pagination */}
                  <div className={styles.tableFooter}>
                    <div className={styles.footerInfo}>
                      Hiển thị <strong>1-{Math.min(10, inspectionRounds.length)}</strong> trong tổng số <strong>{inspectionRounds.length}</strong> đợt kiểm tra
                    </div>
                    <div className={styles.pagination}>
                      <button className={`${styles.paginationButton} ${styles.paginationActive}`}>
                        1
                      </button>
                      <button className={styles.paginationButton} disabled>
                        Sau
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.emptyInspections}>
                  <Layers size={48} className={styles.emptyIcon} />
                  <h3 className={styles.emptyTitle}>Chưa có đợt kiểm tra</h3>
                  <p className={styles.emptyDesc}>
                    Tạo đợt kiểm tra để tổ chức các phiên kiểm tra theo thời gian và biểu mẫu đã định
                  </p>
                  <button className={styles.primaryButton}>
                    <Plus size={18} />
                    Thêm đợt kiểm tra
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {activeTab === 'sessions' && (() => {
          const sessions = mockInspectionSessions?.filter(s => s.planId === decodedPlanId) || [];
          
          return (
            <div className={styles.sessionsContent}>
              <div className={styles.tableHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Danh sách phiên kiểm tra</h2>
                  <p className={styles.sectionDesc}>
                    Tổng {sessions.length} phiên kiểm tra
                  </p>
                </div>
              </div>

              {sessions.length > 0 ? (
                <div className={styles.sessionsTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Cơ sở</th>
                        <th>Địa chỉ</th>
                        <th>Thanh tra viên</th>
                        <th>Ngày kiểm tra</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session, index) => (
                        <tr key={session.id}>
                          <td className={styles.textCenter}>{index + 1}</td>
                          <td>{session.merchantName}</td>
                          <td>{session.location}</td>
                          <td>{session.inspector}</td>
                          <td>{new Date(session.inspectionDate).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              session.status === 'completed' ? styles.statusCompleted :
                              session.status === 'scheduled' ? styles.statusScheduled :
                              styles.statusInProgress
                            }`}>
                              {session.status === 'completed' && 'Hoàn thành'}
                              {session.status === 'scheduled' && 'Đã lên lịch'}
                              {session.status === 'in_progress' && 'Đang thực hiện'}
                            </span>
                          </td>
                          <td>
                            <button className={styles.actionButton} title="Xem chi tiết">
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptySessions}>
                  <CheckCircle2 size={48} className={styles.emptyIcon} />
                  <h3 className={styles.emptyTitle}>Chưa có phiên kiểm tra</h3>
                  <p className={styles.emptyDesc}>
                    Phiên kiểm tra sẽ được tạo từ các đợt kiểm tra
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {activeTab === 'history' && (() => {
          const historyEvents = mockHistoryEvents?.filter(e => e.planId === decodedPlanId) || [];
          
          return (
            <div className={styles.historyContent}>
              <h2 className={styles.historyTitle}>Lịch s thay đổi</h2>
              
              {historyEvents.length > 0 ? (
                <div className={styles.timeline}>
                  {historyEvents.map((event, index) => (
                    <div key={event.id} className={styles.timelineItem}>
                      <div className={styles.timelineDot}>
                        {event.action === 'created' && <Plus size={12} />}
                        {event.action === 'updated' && <Edit size={12} />}
                        {event.action === 'submitted' && <Send size={12} />}
                        {event.action === 'approved' && <CheckCircle2 size={12} />}
                        {event.action === 'rejected' && <XCircle size={12} />}
                      </div>
                      {index < historyEvents.length - 1 && <div className={styles.timelineLine} />}
                      <div className={styles.timelineContent}>
                        <h4 className={styles.timelineTitle}>{event.description}</h4>
                        <p className={styles.timelineUser}>
                          {event.user} • {new Date(event.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyHistory}>
                  <Clock size={48} className={styles.emptyIcon} />
                  <h3 className={styles.emptyTitle}>Chưa có lịch sử</h3>
                  <p className={styles.emptyDesc}>
                    Các thay đổi sẽ được ghi lại tại đây
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Modals */}
      {modalState.type === 'sendApproval' && modalState.plan && (
        <SendForApprovalModal
          isOpen={modalState.type === 'sendApproval'}
          plan={modalState.plan}
          onClose={closeModal}
          onConfirm={() => {
            closeModal();
            toast.success('Đã gửi kế hoạch để phê duyệt');
          }}
        />
      )}

      {modalState.type === 'approve' && modalState.plan && (
        <ApproveModal
          isOpen={modalState.type === 'approve'}
          plan={modalState.plan}
          onClose={closeModal}
          onConfirm={(note) => {
            closeModal();
            toast.success('Đã phê duyệt kế hoạch');
          }}
        />
      )}

      {modalState.type === 'reject' && modalState.plan && (
        <RejectModal
          isOpen={modalState.type === 'reject'}
          plan={modalState.plan}
          onClose={closeModal}
          onConfirm={() => {
            closeModal();
            toast.success('Đã từ chối kế hoạch');
          }}
        />
      )}

      {modalState.type === 'recall' && modalState.plan && (
        <RecallModal
          isOpen={modalState.type === 'recall'}
          plan={modalState.plan}
          onClose={closeModal}
          onConfirm={() => {
            closeModal();
            toast.success('Đã thu hồi kế hoạch');
          }}
        />
      )}

      {modalState.type === 'deploy' && modalState.plan && (
        <DeployModal
          isOpen={modalState.type === 'deploy'}
          plan={modalState.plan}
          onClose={closeModal}
          onConfirm={() => {
            closeModal();
            toast.success('Đã triển khai kế hoạch');
          }}
        />
      )}

      {modalState.type === 'pause' && modalState.plan && (
        <PauseModal
          isOpen={modalState.type === 'pause'}
          plan={modalState.plan}
          onClose={closeModal}
          onConfirm={() => {
            closeModal();
            toast.success('Đã tạm dừng kế hoạch');
          }}
        />
      )}

      {modalState.type === 'delete' && modalState.plan && (
        <DeletePlanModal
          isOpen={modalState.type === 'delete'} 
          plan={modalState.plan}
          onClose={closeModal}
          onConfirm={() => {
            closeModal();
            toast.success('Đã xóa kế hoạch');
            navigate('/plans');
          }}
        />
      )}
    </div>
  );
}