import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { Button } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAssistant } from "@/ai/assistantStore";

type Props = {
  size?: "middle" | "large";
  variant?: "default" | "primary";
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onMouseLeave?: MouseEventHandler<HTMLElement>;
  onClick?: () => void;
};

const LABEL = "Trợ lý công việc MPA";

export default function AiWorkAssistantNavButton({
  size = "middle",
  variant = "default",
  className,
  style,
  icon,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: Props) {
  const navigate = useNavigate();
  const { getOrCreateThread, setActiveThread, updateThreadContext } = useAssistant();

  const handleClick = () => {
    const threadId = getOrCreateThread("lead-risk", "Lead-risk: Inbox AI Demo", {
      page: "/lead-risk/inbox-ai-demo",
    });
    updateThreadContext(threadId, { page: "/lead-risk/inbox-ai-demo" });
    setActiveThread(threadId);
    onClick?.();
    navigate("/lead-risk/inbox-ai-demo");
  };

  return (
    <Button
      size={size}
      type={variant === "primary" ? "primary" : "default"}
      icon={icon ?? <RobotOutlined />}
      onClick={handleClick}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {LABEL}
    </Button>
  );
}
