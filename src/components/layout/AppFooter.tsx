import React from "react";
import { Layout, Typography, theme } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const APP_VERSION = "v0.9.0";

export default function AppFooter() {
  const { token } = theme.useToken();

  return (
    <Footer
      style={{
        padding: "10px 16px",
        background: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          fontSize: 12,
        }}
      >
        <Text type="secondary">Phiên bản: {APP_VERSION}</Text>
        <Text type="secondary">Liên hệ kỹ thuật: Hotline 1900.6789</Text>
      </div>
    </Footer>
  );
}
