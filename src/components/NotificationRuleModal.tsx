/**
 * Notification Rule Modal - MAPPA Portal
 * Modal form Create/Edit/View cho Notification Rules
 * Layout 2 cột theo Figma design
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
} from 'lucide-react';
import {
  NotificationRule,
  EventType,
  RecipientRole,
  ScopeType,
  Channel,
  Priority,
  EventCondition,
  getEventTypeLabel,
  getScopeTypeLabel,
  ALL_EVENT_TYPES,
  ALL_RECIPIENT_ROLES,
  ALL_SCOPE_TYPES,
  ALL_CHANNELS,
  ALL_PRIORITIES,
} from '../app/data/notificationRulesTemplates';

interface NotificationRuleModalProps {
  rule?: NotificationRule | null;
  mode: 'add' | 'edit' | 'view';
  onClose: () => void;
  onSave: (data: Partial<NotificationRule>) => void;
}

export const NotificationRuleModal: React.FC<NotificationRuleModalProps> = ({
  rule,
  mode,
  onClose,
  onSave,
}) => {
  const isViewMode = mode === 'view';

  // Form state
  const [ruleCode, setRuleCode] = useState(rule?.rule_code || '');
  const [ruleName, setRuleName] = useState(rule?.rule_name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [eventType, setEventType] = useState<EventType>(rule?.event_type || 'SLA_AT_RISK');
  const [eventCondition, setEventCondition] = useState<EventCondition>(rule?.event_condition || {});
  const [recipientRoles, setRecipientRoles] = useState<RecipientRole[]>(rule?.recipient_roles || []);
  const [scopeType, setScopeType] = useState<ScopeType>(rule?.scope_type || 'UNIT');
  const [channels, setChannels] = useState<Channel[]>(rule?.channels || []);
  const [cooldownMinutes, setCooldownMinutes] = useState<number | undefined>(rule?.cooldown_minutes);
  const [status, setStatus] = useState<'Active' | 'Disabled'>(rule?.status || 'Active');
  const [priority, setPriority] = useState<Priority>(rule?.priority || 'Medium');

  // Condition builder state
  const [slaHours, setSlaHours] = useState<number | undefined>(rule?.event_condition.sla_hours);
  const [conditionPriority, setConditionPriority] = useState<Priority | undefined>(
    rule?.event_condition.priority
  );
  const [labelCode, setLabelCode] = useState<string | undefined>(rule?.event_condition.label_code);

  // Update event_condition when related fields change
  useEffect(() => {
    const newCondition: EventCondition = {};
    if (slaHours !== undefined) newCondition.sla_hours = slaHours;
    if (conditionPriority) newCondition.priority = conditionPriority;
    if (labelCode) newCondition.label_code = labelCode;
    setEventCondition(newCondition);
  }, [slaHours, conditionPriority, labelCode]);

  // Format condition display
  const getConditionDisplay = () => {
    const parts = [];
    if (slaHours !== undefined) parts.push(`SLA >= ${slaHours}h`);
    if (conditionPriority) parts.push(`Priority = ${conditionPriority}`);
    if (labelCode) parts.push(`Label = ${labelCode}`);
    return parts.length > 0 ? parts.join(', ') : '';
  };

  // Handle save
  const handleSave = () => {
    // Validation
    if (!ruleCode.trim()) {
      alert('Vui lòng nhập mã quy tắc');
      return;
    }
    if (!ruleName.trim()) {
      alert('Vui lòng nhập tên quy tắc');
      return;
    }
    if (recipientRoles.length === 0) {
      alert('Vui lòng chọn ít nhất một vai trò người nhận');
      return;
    }
    if (channels.length === 0) {
      alert('Vui lòng chọn ít nhất một kênh thông báo');
      return;
    }

    const data: Partial<NotificationRule> = {
      rule_code: ruleCode,
      rule_name: ruleName,
      description,
      event_type: eventType,
      event_condition: eventCondition,
      recipient_roles: recipientRoles,
      scope_type: scopeType,
      channels,
      cooldown_minutes: cooldownMinutes,
      status,
      priority,
    };

    onSave(data);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card, white)',
          borderRadius: 'var(--radius-lg, 8px)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--border, #d0d5dd)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'var(--card, white)',
            zIndex: 10,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--foreground, #101828)',
            }}
          >
            {mode === 'add' && 'Thêm Quy Tắc Thông Báo'}
            {mode === 'edit' && 'Chỉnh sửa'}
            {mode === 'view' && 'Chi Tiết Quy Tắc'}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius, 4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted, #f9fafb)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={20} style={{ color: 'var(--muted-foreground, #667085)' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {/* Row 1: Mã * | Tên * */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Mã */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Mã <span style={{ color: 'var(--destructive, #ef4444)' }}>*</span>
              </label>
              <input
                type="text"
                value={ruleCode}
                onChange={(e) => setRuleCode(e.target.value)}
                disabled={isViewMode || mode === 'edit'}
                placeholder=""
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: isViewMode || mode === 'edit' ? 'var(--muted, #f9fafb)' : 'white',
                  color: 'var(--foreground, #101828)',
                }}
              />
            </div>

            {/* Tên */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Tên <span style={{ color: 'var(--destructive, #ef4444)' }}>*</span>
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                disabled={isViewMode}
                placeholder=""
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: isViewMode ? 'var(--muted, #f9fafb)' : 'white',
                  color: 'var(--foreground, #101828)',
                }}
              />
            </div>
          </div>

          {/* Row 2: Sự kiện | Điều kiện */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Sự kiện */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Sự kiện
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                disabled={isViewMode}
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: isViewMode ? 'var(--muted, #f9fafb)' : 'white',
                  color: 'var(--foreground, #101828)',
                }}
              >
                {ALL_EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {getEventTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Điều kiện */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Điều kiện
              </label>
              <input
                type="text"
                value={getConditionDisplay()}
                placeholder="Nhập điều kiện..."
                disabled={true}
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: 'var(--muted, #f9fafb)',
                  color: 'var(--muted-foreground, #667085)',
                  cursor: 'not-allowed',
                }}
                title="Điều kiện được tạo tự động từ sự kiện"
              />
            </div>
          </div>

          {/* Condition Builder (Expandable) */}
          {!isViewMode && (
            <div
              style={{
                padding: '16px',
                background: 'var(--muted, #f9fafb)',
                borderRadius: 'var(--radius, 6px)',
                border: '1px solid var(--border, #d0d5dd)',
                marginBottom: '16px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                  marginBottom: '12px',
                }}
              >
                Chi tiết điều kiện kích hoạt
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* SLA Hours */}
                {eventType === 'SLA_AT_RISK' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: 'var(--foreground, #101828)',
                        minWidth: '100px',
                      }}
                    >
                      SLA Hours ≥
                    </label>
                    <input
                      type="number"
                      value={slaHours || ''}
                      onChange={(e) => setSlaHours(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="VD: 2"
                      style={{
                        padding: '8px 12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        border: '1px solid var(--border, #d0d5dd)',
                        borderRadius: 'var(--radius, 6px)',
                        background: 'white',
                        color: 'var(--foreground, #101828)',
                        width: '150px',
                      }}
                    />
                  </div>
                )}

                {/* Label Code */}
                {eventType === 'LEAD_SENSITIVE_CREATED' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: 'var(--foreground, #101828)',
                        minWidth: '100px',
                      }}
                    >
                      Mã Nhãn
                    </label>
                    <input
                      type="text"
                      value={labelCode || ''}
                      onChange={(e) => setLabelCode(e.target.value)}
                      placeholder="VD: SENSITIVE"
                      style={{
                        padding: '8px 12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        border: '1px solid var(--border, #d0d5dd)',
                        borderRadius: 'var(--radius, 6px)',
                        background: 'white',
                        color: 'var(--foreground, #101828)',
                        flex: 1,
                      }}
                    />
                  </div>
                )}

                {/* Priority */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'var(--foreground, #101828)',
                      minWidth: '100px',
                    }}
                  >
                    Ưu tiên =
                  </label>
                  <select
                    value={conditionPriority || ''}
                    onChange={(e) => setConditionPriority(e.target.value as Priority | undefined)}
                    style={{
                      padding: '8px 12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      border: '1px solid var(--border, #d0d5dd)',
                      borderRadius: 'var(--radius, 6px)',
                      background: 'white',
                      color: 'var(--foreground, #101828)',
                      width: '150px',
                    }}
                  >
                    <option value="">-- Không giới hạn --</option>
                    {ALL_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Row 3: Người nhận | Phạm Vi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Người nhận */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Người nhận
              </label>
              <input
                type="text"
                value={recipientRoles.join(', ')}
                readOnly
                placeholder="Chọn người nhận..."
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: 'var(--muted, #f9fafb)',
                  color: 'var(--muted-foreground, #667085)',
                  cursor: 'not-allowed',
                }}
              />
              {!isViewMode && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {ALL_RECIPIENT_ROLES.map((role) => (
                    <label
                      key={role}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={recipientRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRecipientRoles([...recipientRoles, role]);
                          } else {
                            setRecipientRoles(recipientRoles.filter((r) => r !== role));
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {role}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Phạm Vi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Phạm Vi
              </label>
              <select
                value={scopeType}
                onChange={(e) => setScopeType(e.target.value as ScopeType)}
                disabled={isViewMode}
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: isViewMode ? 'var(--muted, #f9fafb)' : 'white',
                  color: 'var(--foreground, #101828)',
                }}
              >
                {ALL_SCOPE_TYPES.map((scope) => (
                  <option key={scope} value={scope}>
                    {getScopeTypeLabel(scope)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Kênh | Ưu Tiên */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Kênh */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Kênh
              </label>
              <input
                type="text"
                value={channels.join(', ')}
                readOnly
                placeholder="Chọn kênh..."
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: 'var(--muted, #f9fafb)',
                  color: 'var(--muted-foreground, #667085)',
                  cursor: 'not-allowed',
                }}
              />
              {!isViewMode && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {ALL_CHANNELS.map((channel) => (
                    <label
                      key={channel}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setChannels([...channels, channel]);
                          } else {
                            setChannels(channels.filter((c) => c !== channel));
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Ưu Tiên */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Ưu Tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                disabled={isViewMode}
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: isViewMode ? 'var(--muted, #f9fafb)' : 'white',
                  color: 'var(--foreground, #101828)',
                }}
              >
                {ALL_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Trạng thái | Cooldown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* Trạng thái */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Disabled')}
                disabled={isViewMode}
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: isViewMode ? 'var(--muted, #f9fafb)' : 'white',
                  color: 'var(--foreground, #101828)',
                }}
              >
                <option value="Active">Hoạt động</option>
                <option value="Disabled">Không hoạt động</option>
              </select>
            </div>

            {/* Cooldown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Cooldown (phút)
              </label>
              <input
                type="number"
                value={cooldownMinutes || ''}
                onChange={(e) => setCooldownMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
                disabled={isViewMode}
                placeholder="VD: 30"
                style={{
                  padding: '10px 14px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  background: isViewMode ? 'var(--muted, #f9fafb)' : 'white',
                  color: 'var(--foreground, #101828)',
                }}
              />
            </div>
          </div>

          {/* Row 6: Mô tả (full width) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--foreground, #101828)',
              }}
            >
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isViewMode}
              placeholder="Mô tả chi tiết..."
              rows={4}
              style={{
                padding: '10px 14px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                border: '1px solid var(--border, #d0d5dd)',
                borderRadius: 'var(--radius, 6px)',
                background: isViewMode ? 'var(--muted, #f9fafb)' : 'white',
                color: 'var(--foreground, #101828)',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        {!isViewMode && (
          <div
            style={{
              padding: '21px 20px',
              borderTop: '1px solid var(--border, #d0d5dd)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              position: 'sticky',
              bottom: 0,
              background: 'var(--card, white)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '11px 19px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                border: '1px solid var(--border, #d0d5dd)',
                borderRadius: 'var(--radius, 6px)',
                background: 'white',
                color: 'var(--foreground, #101828)',
                cursor: 'pointer',
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '11px 18px 11px 42px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                borderRadius: 'var(--radius, 6px)',
                background: 'var(--primary, #005cb6)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
              }}
            >
              <Save size={16} style={{ position: 'absolute', left: '18px' }} />
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};