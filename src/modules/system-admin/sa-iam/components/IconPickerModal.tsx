import React from "react";
import { Button, Input, Modal, Space, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ICONS, getIconComponent } from "./iconRegistry";

type IconPickerModalProps = {
  open: boolean;
  value?: string | null;
  onClose: () => void;
  onSelect: (iconName: string | null) => void;
};

const iconNames = Object.keys(ICONS).sort((a, b) => a.localeCompare(b));

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  open,
  value,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return iconNames;
    return iconNames.filter((name) => name.toLowerCase().includes(keyword));
  }, [search]);

  return (
    <Modal
      centered
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title="Chọn icon"
      footer={null}
      destroyOnHidden
      maskClosable
      keyboard
      width={720}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Tìm icon..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="grid grid-cols-6 gap-3">
          {filtered.map((name) => {
            const Icon = getIconComponent(name);
            const isActive = value === name;
            return (
              <button
                key={name}
                type="button"
                className={`flex flex-col items-center gap-2 rounded border p-2 text-xs transition ${
                  isActive ? "border-blue-500 bg-blue-50" : "border-transparent hover:border-blue-300"
                }`}
                onClick={() => {
                  onSelect(name);
                  onClose();
                }}
              >
                {Icon ? <Icon size={20} /> : null}
                <span className="truncate">{name}</span>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <Typography.Text type="secondary">Không tìm thấy icon phù hợp.</Typography.Text>
        ) : null}
        <div className="flex justify-end">
          <Button
            onClick={() => {
              onSelect(null);
              onClose();
            }}
          >
            Xóa icon
          </Button>
        </div>
      </Space>
    </Modal>
  );
};
