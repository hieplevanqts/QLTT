import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Rate,
  Select,
  Space,
  Steps,
  Table,
  Tag,
  Typography,
} from "antd";
import { PictureOutlined, VideoCameraOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { LeadMock, LeadStatus } from "@/modules/lead-risk/mocks/leadInboxMock";

const { Text, Title } = Typography;

export type WizardAction = "plan" | "verify" | "discard";

type ApplyPayload =
  | {
      departmentId: string;
      teamId: string;
      note?: string;
    }
  | {
      assessment: string;
      rating: number;
      note?: string;
    };

type Props = {
  open: boolean;
  tag: string | null;
  leads: LeadMock[];
  presetAction?: WizardAction | null;
  presetSelectedIds?: string[];
  startStep?: 0 | 1;
  onSelectionChange?: (selectedIds: string[], selectedLeads: LeadMock[]) => void;
  onClose: () => void;
  onApply: (action: WizardAction, selectedIds: string[], payload: ApplyPayload) => void;
};

type Department = { id: string; name: string; teams: string[] };

const departments: Department[] = [
  { id: "dept-tt", name: "Phòng Thanh tra - Kiểm tra", teams: ["Đội 1", "Đội 2"] },
  { id: "dept-nv", name: "Phòng Nghiệp vụ - Tổng hợp", teams: ["Tổ phân tích", "Tổ tổng hợp"] },
  { id: "dept-at", name: "Tổ ATTP", teams: ["Tổ ATTP 1"] },
  { id: "dept-cn", name: "Tổ Chống hàng giả", teams: ["Tổ chống giả 1", "Tổ chống giả 2"] },
];

const assessmentOptions = [
  "Tin rác",
  "Thiếu thông tin",
  "Có dấu hiệu trục lợi",
  "Trùng lặp",
  "Khác",
];

const statusTag = (status: LeadStatus) => {
  switch (status) {
    case "dang_xu_ly":
      return <Tag color="blue">Đang xử lý</Tag>;
    case "khong_dang":
      return <Tag color="default">Không đáng</Tag>;
    case "can_xem_xet":
    default:
      return <Tag color="warning">Cần xem xét</Tag>;
  }
};

export default function CategoryLeadsWizardModal({
  open,
  tag,
  leads,
  presetAction,
  presetSelectedIds,
  startStep,
  onSelectionChange,
  onClose,
  onApply,
}: Props) {
  const [step, setStep] = useState<0 | 1>(0);
  const [action, setAction] = useState<WizardAction | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [departmentId, setDepartmentId] = useState<string | undefined>();
  const [teamId, setTeamId] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(4);
  const [assessment, setAssessment] = useState<string | undefined>();
  const [reporterNote, setReporterNote] = useState("");

  useEffect(() => {
    if (open) {
      const initialKeys = presetSelectedIds ?? [];
      const initialAction = presetAction ?? null;
      setStep(initialKeys.length && initialAction ? 1 : startStep ?? 0);
      setAction(initialAction);
      setSelectedRowKeys(initialKeys);
      setSearchText("");
      setDepartmentId(undefined);
      setTeamId(undefined);
      setNote("");
      setRating(4);
      setAssessment(undefined);
      setReporterNote("");

      if (initialKeys.length && onSelectionChange) {
        const selected = leads.filter((lead) => initialKeys.includes(lead.id));
        onSelectionChange(initialKeys, selected);
      }
    }
  }, [open, tag, presetSelectedIds, presetAction, startStep, onSelectionChange, leads]);

  const filtered = useMemo(() => {
    if (!tag) return [];
    return leads.filter((lead) => (lead.categoryLabel || lead.category) === tag);
  }, [leads, tag]);

  const searched = useMemo(() => {
    if (!searchText) return filtered;
    const query = searchText.trim().toLowerCase();
    return filtered.filter((lead) =>
      lead.title.toLowerCase().includes(query) || lead.code.toLowerCase().includes(query)
    );
  }, [filtered, searchText]);

  const selectedIds = selectedRowKeys.map((key) => String(key));
  const selectedLeads = useMemo(
    () => leads.filter((lead) => selectedIds.includes(lead.id)),
    [leads, selectedIds]
  );

  const columns: ColumnsType<LeadMock> = [
    {
      title: "Mã",
      dataIndex: "code",
      width: 110,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: "Địa bàn",
      dataIndex: "locationText",
      width: 170,
      render: (value: string) => (
        <Text ellipsis={{ tooltip: value }}>{value}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status: LeadStatus) => statusTag(status),
    },
    {
      title: "Độ tin cậy",
      dataIndex: ["ai", "confidence"],
      width: 110,
      render: (value: number) => `${value}%`,
    },
    {
      title: "Bằng chứng",
      key: "evidence",
      width: 90,
      render: (_, record) => {
        const hasVideo = (record.evidence?.videos?.length ?? 0) > 0;
        const hasImage = (record.evidence?.images?.length ?? 0) > 0;
        return (
          <Space size={6}>
            {hasVideo && <VideoCameraOutlined style={{ color: "#ff4d4f" }} />}
            {hasImage && <PictureOutlined style={{ color: "#1677ff" }} />}
          </Space>
        );
      },
    },
  ];

  const handleSelectionChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
    if (onSelectionChange) {
      const ids = keys.map((key) => String(key));
      const selected = leads.filter((lead) => ids.includes(lead.id));
      onSelectionChange(ids, selected);
    }
  };

  const handleSelectAll = () => {
    handleSelectionChange(searched.map((lead) => lead.id));
  };

  const handleUnselectAll = () => {
    handleSelectionChange([]);
  };

  const stepTitle = action === "discard" ? "Đánh giá người tố giác" : "Chọn bộ phận xử lý";

  const summaryCodes = selectedLeads.map((lead) => lead.code);
  const summaryCodesTrimmed = summaryCodes.slice(0, 8);
  const moreCount = summaryCodes.length - summaryCodesTrimmed.length;

  const firstReporter = selectedLeads[0];

  const actionDisabled = selectedRowKeys.length === 0;

  const handleConfirm = () => {
    if (!action) return;
    if (action === "discard") {
      if (!assessment) return;
      onApply(action, selectedIds, {
        assessment,
        rating,
        note: reporterNote,
      });
      return;
    }
    if (!departmentId || !teamId) return;
    onApply(action, selectedIds, {
      departmentId,
      teamId,
      note,
    });
  };

  const modalFooter = step === 0 ? (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <Button onClick={onClose}>Đóng</Button>
      <Space>
        <Button
          type="primary"
          disabled={actionDisabled}
          onClick={() => {
            setAction("plan");
            setStep(1);
          }}
        >
          Đưa vào kế hoạch
        </Button>
        <Button
          disabled={actionDisabled}
          onClick={() => {
            setAction("verify");
            setStep(1);
          }}
        >
          Chuyển bộ phận xác minh
        </Button>
        <Button
          danger
          disabled={actionDisabled}
          onClick={() => {
            setAction("discard");
            setStep(1);
          }}
        >
          Loại bỏ
        </Button>
      </Space>
    </div>
  ) : action === "discard" ? (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <Button onClick={() => setStep(0)}>Quay lại</Button>
      <Button danger disabled={!assessment} onClick={handleConfirm}>
        Xác nhận loại bỏ
      </Button>
    </div>
  ) : (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <Button onClick={() => setStep(0)}>Quay lại</Button>
      <Button type="primary" disabled={!departmentId || !teamId} onClick={handleConfirm}>
        Xác nhận
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={960}
      footer={modalFooter}
      title={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Title level={5} style={{ margin: 0 }}>
            Xử lý tin theo danh mục
          </Title>
          <Steps
            current={step}
            size="small"
            items={[
              { title: "Chọn tin theo danh mục" },
              { title: stepTitle },
            ]}
          />
        </div>
      }
    >
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <Title level={5} style={{ marginBottom: 0 }}>
              Danh sách tin báo: {tag}
            </Title>
            <Text type="secondary">Lấy từ nguồn tin trực tiếp (mock).</Text>
          </div>

          <Space style={{ justifyContent: "space-between", width: "100%" }} wrap>
            <Input.Search
              placeholder="Tìm theo mã hoặc tiêu đề"
              allowClear
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              style={{ width: 280 }}
            />
            <Space wrap>
              <Button onClick={handleSelectAll}>Chọn tất cả</Button>
              <Button onClick={handleUnselectAll}>Bỏ chọn</Button>
              <Text type="secondary">
                Đã chọn: {selectedRowKeys.length} / {searched.length}
              </Text>
            </Space>
          </Space>

          <Table
            rowKey="id"
            dataSource={searched}
            columns={columns}
            pagination={{ pageSize: 6 }}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => handleSelectionChange(keys),
            }}
            scroll={{ x: 800 }}
          />
        </div>
      )}

      {step === 1 && action && action !== "discard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Title level={5} style={{ margin: 0 }}>
            Chọn bộ phận xử lý
          </Title>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
            <Form layout="vertical">
              <Form.Item label="Đơn vị/Phòng ban" required>
                <Select
                  placeholder="Chọn phòng ban"
                  value={departmentId}
                  onChange={(value) => {
                    setDepartmentId(value);
                    setTeamId(undefined);
                  }}
                  options={departments.map((dept) => ({ label: dept.name, value: dept.id }))}
                />
              </Form.Item>
              <Form.Item label="Đội/nhóm" required>
                <Select
                  placeholder="Chọn đội/nhóm"
                  value={teamId}
                  onChange={setTeamId}
                  options={
                    departments
                      .find((dept) => dept.id === departmentId)?.teams
                      .map((team) => ({ label: team, value: team })) || []
                  }
                  disabled={!departmentId}
                />
              </Form.Item>
              <Form.Item label="Ghi chú chuyển xử lý">
                <Input.TextArea
                  rows={4}
                  placeholder="Ghi chú thêm (tuỳ chọn)"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </Form.Item>
            </Form>

            <Card size="small" title="Tóm tắt">
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Tag color="blue">{tag}</Tag>
                <Text strong>Đã chọn: {selectedRowKeys.length} tin</Text>
                <Divider style={{ margin: "8px 0" }} />
                <Space wrap>
                  {summaryCodesTrimmed.map((code) => (
                    <Tag key={code}>{code}</Tag>
                  ))}
                  {moreCount > 0 && <Tag>+{moreCount}</Tag>}
                </Space>
              </Space>
            </Card>
          </div>

        </div>
      )}

      {step === 1 && action === "discard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Title level={5} style={{ margin: 0 }}>
            Đánh giá người tố giác
          </Title>
          <Card size="small">
            <Space direction="vertical" size={6}>
              <Text>
                <strong>Người phản ánh:</strong> {firstReporter?.reporterName || "—"}
              </Text>
              <Text>
                <strong>Kênh:</strong> {firstReporter?.reporterChannel || "—"}
              </Text>
              <Text>
                <strong>Liên hệ:</strong> {firstReporter?.reporterPhone || "—"}
              </Text>
              <Text>
                <strong>Lịch sử gửi:</strong> {firstReporter?.reporterHistory || Math.max(1, selectedLeads.length)} lần (mock)
              </Text>
            </Space>
          </Card>

          <Form layout="vertical">
            <Form.Item label="Đánh giá độ tin cậy">
              <Rate value={rating} onChange={setRating} />
            </Form.Item>
            <Form.Item label="Nhận định" required>
              <Select
                placeholder="Chọn nhận định"
                value={assessment}
                onChange={setAssessment}
                options={assessmentOptions.map((item) => ({ label: item, value: item }))}
              />
            </Form.Item>
            <Form.Item label="Ghi chú nội bộ">
              <Input.TextArea
                rows={4}
                placeholder="Ghi chú thêm"
                value={reporterNote}
                onChange={(event) => setReporterNote(event.target.value)}
              />
            </Form.Item>
          </Form>

          <Card size="small" style={{ background: "#fff7e6" }}>
            <Text>
              Các tin đã chọn sẽ được <strong>Loại bỏ</strong> (mock).
            </Text>
          </Card>

        </div>
      )}
    </Modal>
  );
}
