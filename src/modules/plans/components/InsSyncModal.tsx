import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Steps,
  Switch,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CloudSyncOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export interface InsSyncModalProps {
  open: boolean;
  onClose: () => void;
  defaultOrgUnitId?: string;
}

type InsStatus = 'draft' | 'pending' | 'approved' | 'active' | 'completed';

interface InsPlan {
  id: string;
  code: string;
  title: string;
  startDate: string;
  endDate: string;
  unit: string;
  status: InsStatus;
  note?: string;
}

interface SyncSummary {
  total: number;
  success: number;
  skipped: number;
  error: number;
}

interface SyncLog {
  time: string;
  message: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

const MOCK_ORG_UNITS = [
  { value: 'qltt_cuc', label: 'Cục QLTT' },
  { value: 'qltt_hn', label: 'Chi cục QLTT Hà Nội' },
  { value: 'qltt_hcm', label: 'Chi cục QLTT TP.HCM' },
  { value: 'doi_01_hn', label: 'Đội QLTT số 1 - Hà Nội' },
  { value: 'doi_02_hn', label: 'Đội QLTT số 2 - Hà Nội' },
  { value: 'doi_03_hn', label: 'Đội QLTT số 3 - Hà Nội' },
];

const STATUS_META: Record<InsStatus, { label: string; color: string }> = {
  draft: { label: 'Nháp', color: 'default' },
  pending: { label: 'Chờ duyệt', color: 'orange' },
  approved: { label: 'Đã duyệt', color: 'green' },
  active: { label: 'Đang triển khai', color: 'blue' },
  completed: { label: 'Hoàn thành', color: 'purple' },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function mockPreviewInsPlans(): Promise<InsPlan[]> {
  await sleep(800 + Math.random() * 500);
  const records = Array.from({ length: 20 }).map((_, index) => {
    const base = dayjs().subtract(45 - index * 2, 'day');
    const start = base.add(index % 5, 'day');
    const end = start.add(10 + (index % 6), 'day');
    const statusKeys: InsStatus[] = ['draft', 'pending', 'approved', 'active', 'completed'];
    const status = statusKeys[index % statusKeys.length];
    return {
      id: `INS-${2026}${String(index + 1).padStart(3, '0')}`,
      code: `INS-KH-${2026}-${String(index + 1).padStart(3, '0')}`,
      title: `Kế hoạch kiểm tra chuyên đề số ${index + 1}`,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      unit: MOCK_ORG_UNITS[index % MOCK_ORG_UNITS.length].label,
      status,
      note: index % 4 === 0 ? 'Có đính kèm tài liệu' : undefined,
    };
  });
  return records;
}

async function mockSyncPlans(
  items: InsPlan[],
  onProgress: (percent: number) => void,
  onLog: (log: SyncLog) => void,
  onSummary: (summary: SyncSummary) => void,
) {
  const summary: SyncSummary = { total: items.length, success: 0, skipped: 0, error: 0 };

  onLog({ time: dayjs().format('HH:mm:ss'), message: 'Khởi tạo phiên đồng bộ...', status: 'info' });
  await sleep(400);
  onLog({ time: dayjs().format('HH:mm:ss'), message: 'Kết nối INS thành công.', status: 'success' });
  await sleep(400);

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    await sleep(250 + Math.random() * 200);
    const roll = Math.random();
    if (roll < 0.72) {
      summary.success += 1;
      onLog({
        time: dayjs().format('HH:mm:ss'),
        message: `Đồng bộ ${item.code} thành công.`,
        status: 'success',
      });
    } else if (roll < 0.9) {
      summary.skipped += 1;
      onLog({
        time: dayjs().format('HH:mm:ss'),
        message: `Bỏ qua ${item.code} (đã tồn tại).`,
        status: 'warning',
      });
    } else {
      summary.error += 1;
      onLog({
        time: dayjs().format('HH:mm:ss'),
        message: `Lỗi khi đồng bộ ${item.code}.`,
        status: 'error',
      });
    }
    onSummary({ ...summary });
    onProgress(Math.round(((i + 1) / items.length) * 100));
  }

  onLog({ time: dayjs().format('HH:mm:ss'), message: 'Hoàn tất đồng bộ.', status: 'success' });
  onSummary({ ...summary });
  onProgress(100);
}

export default function InsSyncModal({ open, onClose, defaultOrgUnitId }: InsSyncModalProps) {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [dataTypes, setDataTypes] = useState<string[]>(['plans']);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<InsPlan[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [summary, setSummary] = useState<SyncSummary>({ total: 0, success: 0, skipped: 0, error: 0 });

  const initialRange = useMemo(
    () => [dayjs().subtract(30, 'day'), dayjs()],
    [],
  );

  const previewReady = previewData.length > 0;
  const canProceedStep2 = previewReady && selectedRowKeys.length > 0;

  const handleClose = () => {
    if (isSyncing) return;
    onClose();
  };

  const handleNext = async () => {
    if (step === 0) {
      await form.validateFields();
      setStep(1);
      return;
    }
    if (step === 1 && canProceedStep2) {
      setStep(2);
    }
  };

  const handlePreview = async () => {
    if (!dataTypes.length) return;
    setPreviewLoading(true);
    setPreviewData([]);
    setSelectedRowKeys([]);
    try {
      const data = await mockPreviewInsPlans();
      setPreviewData(data);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleStartSync = async () => {
    if (!previewData.length || selectedRowKeys.length === 0) return;
    const selectedItems = previewData.filter((item) => selectedRowKeys.includes(item.id));
    setIsSyncing(true);
    setSyncDone(false);
    setProgress(0);
    setLogs([]);
    setSummary({ total: selectedItems.length, success: 0, skipped: 0, error: 0 });

    await mockSyncPlans(
      selectedItems,
      (percent) => setProgress(percent),
      (log) => setLogs((prev) => [...prev, log]),
      (nextSummary) => setSummary(nextSummary),
    );

    setIsSyncing(false);
    setSyncDone(true);
  };

  const handleDownloadReport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      summary,
      logs,
      selectedIds: selectedRowKeys,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ins-sync-report-${dayjs().format('YYYYMMDD-HHmmss')}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const columns: ColumnsType<InsPlan> = [
    { title: 'Mã INS', dataIndex: 'code', key: 'code', width: 150 },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: 280 },
    {
      title: 'Thời gian',
      key: 'time',
      width: 180,
      render: (_, record) => (
        <span>
          {dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.endDate).format('DD/MM/YYYY')}
        </span>
      ),
    },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit', width: 200 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: InsStatus) => <Tag color={STATUS_META[status].color}>{STATUS_META[status].label}</Tag>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 160,
      render: (note?: string) => note || '—',
    },
  ];

  const stepItems = [
    { title: 'Thiết lập' },
    { title: 'Xem trước' },
    { title: 'Đồng bộ' },
  ];

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={960}
      destroyOnClose
      maskClosable={false}
      closable={!isSyncing}
      keyboard={!isSyncing}
      title={
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Kết nối INS</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Đồng bộ dữ liệu từ ins.dms.gov.vn về MAPPA (mock)
          </Text>
        </div>
      }
      footer={
        <Space>
          {step > 0 && (
            <Button onClick={() => setStep(step - 1)} disabled={isSyncing}>
              Quay lại
            </Button>
          )}
          {step === 0 && (
            <Button type="primary" onClick={handleNext} disabled={isSyncing}>
              Tiếp tục
            </Button>
          )}
          {step === 1 && (
            <Button type="primary" onClick={handleNext} disabled={!canProceedStep2 || isSyncing}>
              Tiếp tục
            </Button>
          )}
          {step === 2 && (
            <>
              <Button
                type="primary"
                icon={isSyncing ? <LoadingOutlined /> : <PlayCircleOutlined />}
                onClick={handleStartSync}
                disabled={isSyncing || selectedRowKeys.length === 0}
              >
                Bắt đầu đồng bộ
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownloadReport} disabled={!syncDone}>
                Tải báo cáo
              </Button>
              <Button onClick={handleClose} disabled={!syncDone}>
                Đóng
              </Button>
            </>
          )}
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Steps current={step} items={stepItems} />

        {step === 0 && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              type="info"
              showIcon
              message="Hiện đang dùng dữ liệu mô phỏng. Khi có API/SSO, sẽ chuyển sang đồng bộ thật."
            />

            <Form
              form={form}
              layout="vertical"
              disabled={isSyncing}
              initialValues={{
                source: 'INS - DMS (ins.dms.gov.vn)',
                mode: 'mock',
                orgUnit: defaultOrgUnitId || MOCK_ORG_UNITS[0].value,
                dateRange: initialRange,
                syncType: 'pull',
                upsert: true,
                onlyNew: true,
                tagSource: true,
              }}
            >
              <Space size={16} align="start" style={{ width: '100%' }}>
                <Form.Item label="Nguồn hệ thống" name="source" style={{ flex: 1 }}>
                  <Input disabled prefix={<LinkOutlined />} />
                </Form.Item>
                <Form.Item
                  label="Chế độ"
                  name="mode"
                  rules={[{ required: true, message: 'Chọn chế độ' }]}
                  style={{ width: 220 }}
                >
                  <Select
                    options={[
                      { value: 'mock', label: 'Mô phỏng (Mock)' },
                      { value: 'real', label: 'Thật (Sắp có)', disabled: true },
                    ]}
                  />
                </Form.Item>
              </Space>

              <Space size={16} align="start" style={{ width: '100%' }}>
                <Form.Item
                  label="Đơn vị lấy dữ liệu"
                  name="orgUnit"
                  rules={[{ required: true, message: 'Chọn đơn vị' }]}
                  style={{ flex: 1 }}
                >
                  <Select options={MOCK_ORG_UNITS} placeholder="Chọn đơn vị" />
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      Khoảng thời gian{' '}
                      <Tooltip title="Mặc định 30 ngày gần nhất">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  name="dateRange"
                  rules={[{ required: true, message: 'Chọn khoảng thời gian' }]}
                  style={{ flex: 1 }}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Space>

              <Space size={16} align="start" style={{ width: '100%' }}>
                <Form.Item
                  label="Kiểu đồng bộ"
                  name="syncType"
                  rules={[{ required: true, message: 'Chọn kiểu đồng bộ' }]}
                  style={{ width: 240 }}
                >
                  <Select options={[{ value: 'pull', label: 'Kéo dữ liệu về (Pull)' }]} />
                </Form.Item>
                <Space direction="vertical" size="small" style={{ paddingTop: 30 }}>
                  <Form.Item name="upsert" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                  </Form.Item>
                  <Text type="secondary">Upsert theo mã INS (có cập nhật nếu trùng)</Text>
                </Space>
                <Space direction="vertical" size="small" style={{ paddingTop: 30 }}>
                  <Form.Item name="onlyNew" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                  </Form.Item>
                  <Text type="secondary">Chỉ lấy kế hoạch mới/chưa có trong MAPPA</Text>
                </Space>
                <Space direction="vertical" size="small" style={{ paddingTop: 30 }}>
                  <Form.Item name="tagSource" valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                  </Form.Item>
                  <Text type="secondary">Gắn nhãn nguồn = INS</Text>
                </Space>
              </Space>
            </Form>
          </Space>
        )}

        {step === 1 && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Divider orientation="left">Loại dữ liệu</Divider>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Checkbox.Group
                value={dataTypes}
                onChange={(values) => setDataTypes(values as string[])}
                disabled={isSyncing}
              >
                <Space direction="vertical">
                  <Checkbox value="plans">Kế hoạch kiểm tra</Checkbox>
                  <Checkbox value="rounds">Đợt/Chuyên đề</Checkbox>
                  <Checkbox value="profiles" disabled>
                    Hồ sơ liên quan <Tag color="gold">Sắp có</Tag>
                  </Checkbox>
                </Space>
              </Checkbox.Group>
            </Space>

            <Space align="center">
              <Button
                type="primary"
                icon={<CloudSyncOutlined />}
                loading={previewLoading}
                onClick={handlePreview}
                disabled={isSyncing || dataTypes.length === 0}
              >
                Xem trước
              </Button>
              <Text type="secondary">Dựa trên cấu hình ở bước 1</Text>
            </Space>

            <Divider />

            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>
                Tìm thấy {previewData.length} bản ghi • Đã chọn {selectedRowKeys.length}
              </Text>
              <Table
                columns={columns}
                dataSource={previewData}
                rowKey="id"
                size="small"
                loading={previewLoading}
                pagination={{ pageSize: 8 }}
                scroll={{ y: 240 }}
                rowSelection={{
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }}
              />
            </Space>
          </Space>
        )}

        {step === 2 && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Progress percent={progress} status={syncDone ? 'success' : isSyncing ? 'active' : 'normal'} />

            <Space size={24} wrap>
              <Text>
                Tổng chọn: <Text strong>{summary.total}</Text>
              </Text>
              <Text>
                Thành công: <Text strong>{summary.success}</Text>
              </Text>
              <Text>
                Bỏ qua: <Text strong>{summary.skipped}</Text>
              </Text>
              <Text>
                Lỗi: <Text strong>{summary.error}</Text>
              </Text>
            </Space>

            <Divider />

            <Text strong>Nhật ký đồng bộ</Text>
            <div
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                maxHeight: 220,
                overflow: 'auto',
                background: '#fafafa',
              }}
            >
              {logs.length === 0 ? (
                <Text type="secondary">Chưa có hoạt động nào.</Text>
              ) : (
                <Timeline
                  items={logs.map((log, index) => ({
                    key: index,
                    color: log.status === 'error' ? 'red' : log.status === 'warning' ? 'orange' : 'blue',
                    children: (
                      <span>
                        <Text type="secondary" style={{ marginRight: 8 }}>
                          {log.time}
                        </Text>
                        <Text>{log.message}</Text>
                      </span>
                    ),
                  }))}
                />
              )}
            </div>

            {syncDone && (
              <Alert
                type={summary.error > 0 ? 'warning' : 'success'}
                showIcon
                message={
                  summary.error > 0
                    ? 'Đồng bộ hoàn tất, có một số bản ghi lỗi.'
                    : 'Đồng bộ hoàn tất thành công.'
                }
              />
            )}
          </Space>
        )}
      </Space>
    </Modal>
  );
}
