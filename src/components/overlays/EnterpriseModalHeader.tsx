import React from "react";
import { Badge, Tag, Typography, Space } from "antd";

type BadgeStatus = "success" | "processing" | "default" | "error" | "warning";

type Props = {
  title: React.ReactNode;
  badgeStatus?: BadgeStatus;
  statusLabel?: string;
  code?: string;
  moduleTag?: string;
  extra?: React.ReactNode;
};

export function EnterpriseModalHeader({
  title,
  badgeStatus = "default",
  statusLabel,
  code,
  moduleTag,
  extra,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-base font-semibold leading-6">{title}</div>
      </div>

      <Space size={8} wrap className="shrink-0">
        {statusLabel ? <Badge status={badgeStatus} text={statusLabel} /> : null}
        {moduleTag ? <Tag>{moduleTag}</Tag> : null}
        {code ? (
          <Typography.Text code copyable={{ text: code }}>
            {code}
          </Typography.Text>
        ) : null}
        {extra}
      </Space>
    </div>
  );
}
