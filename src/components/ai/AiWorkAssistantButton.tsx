import type { CSSProperties } from "react";
import { Button } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { useAssistant } from "@/ai/assistantStore";

type Props = {
  size?: "middle" | "large";
  variant?: "default" | "primary";
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

const LABEL = "Trợ lý công việc MPA";

export default function AiWorkAssistantButton({
  size = "middle",
  variant = "default",
  onClick,
  className,
  style,
}: Props) {
  const { setDrawerOpen } = useAssistant();

  const handleClick = onClick ?? (() => setDrawerOpen(true));

  return (
    <Button
      size={size}
      type={variant === "primary" ? "primary" : "default"}
      icon={<RobotOutlined />}
      onClick={handleClick}
      className={className}
      style={style}
    >
      {LABEL}
    </Button>
  );
}
