import React from "react";
import { Button, Modal } from "antd";

type Props = {
  title?: React.ReactNode;
  header?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  width?: number;
  footer?: React.ReactNode;
  children: React.ReactNode;
  afterClose?: () => void;
};

export function CenteredModalShell({
  title,
  header,
  open,
  onClose,
  width = 720,
  footer,
  children,
  afterClose,
}: Props) {
  const mergedFooter =
    footer !== undefined ? (
      footer
    ) : (
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Đóng</Button>
      </div>
    );

  return (
    <Modal
      title={header ?? title}
      open={open}
      onCancel={onClose}
      footer={mergedFooter}
      centered
      keyboard
      maskClosable
      destroyOnHidden
      width={width}
      afterClose={afterClose}
      classNames={{
        body: "max-h-[70vh] overflow-auto",
      }}
      styles={{
        body: { padding: 16 },
      }}
    >
      {children}
    </Modal>
  );
}
