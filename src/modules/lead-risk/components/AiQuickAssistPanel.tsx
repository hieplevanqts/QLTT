import { useEffect, useMemo, useState } from "react";
import { Button, Input, Spin, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useAssistant, mockAiRespond, createId, now } from "@/ai/assistantStore";
import { renderMessageContent } from "@/ai/renderMessage";
import styles from "@/modules/leads/pages/lead-risk/LeadInboxAIDemo.module.css";

const { Text } = Typography;

type PageContext = {
  page: "/lead-risk/inbox-ai-demo";
  focus?: {
    kind: "lead" | "tag" | null;
    leadId?: string;
    tag?: string;
  };
  selectedTag?: string;
  selectedLeadIds?: string[];
  selectedLeads?: {
    id: string;
    code: string;
    title: string;
    categoryLabel?: string;
    wardLabel?: string;
    reliability?: number;
    status?: string;
    hasVideo?: boolean;
    hasImage?: boolean;
  }[];
};

const QUICK_PROMPTS = [
  "Tóm tắt tin đã chọn",
  "Gợi ý hướng xử lý",
  "Soạn yêu cầu bổ sung thông tin",
];

export default function AiQuickAssistPanel({
  pageContext,
  collapsed,
}: {
  pageContext: PageContext;
  collapsed?: boolean;
}) {
  const {
    threads,
    activeThreadId,
    createThread,
    setActiveThread,
    setDrawerOpen,
    appendMessage,
    updateContext,
  } = useAssistant();

  const [localThreadId, setLocalThreadId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (localThreadId) return;
    const existing = threads.find(
      (thread) => thread.scope === "lead-risk" && thread.title === "Lead-risk: Inbox AI Demo"
    );
    const id = existing?.id ?? createThread("lead-risk", "Lead-risk: Inbox AI Demo", pageContext);
    setLocalThreadId(id);
    setActiveThread(id);
  }, [localThreadId, threads, createThread, setActiveThread, pageContext]);

  useEffect(() => {
    if (localThreadId) {
      updateContext(localThreadId, pageContext);
    }
  }, [localThreadId, pageContext, updateContext]);

  const activeThread = useMemo(
    () =>
      (activeThreadId && threads.find((thread) => thread.id === activeThreadId)) ??
      (localThreadId ? threads.find((thread) => thread.id === localThreadId) : null) ??
      null,
    [threads, localThreadId, activeThreadId]
  );

  const previewMessages = activeThread?.messages.slice(-4) ?? [];
  const lastAssistantId =
    [...previewMessages].reverse().find((message) => message.role === "assistant")?.id ?? null;
  const showApplyActions = (pageContext.selectedLeadIds?.length ?? 0) > 0;

  const dispatchWizardEvent = (action: "verify" | "plan") => {
    const detail = {
      action,
      tag: pageContext.selectedTag,
      selectedIds: pageContext.selectedLeadIds ?? [],
    };
    window.dispatchEvent(new CustomEvent("mappa:open-lead-wizard", { detail }));
  };

  const sendMessage = async (text: string) => {
    if (!activeThread || !text.trim()) return;
    const content = text.trim();
    setInputValue("");
    appendMessage(activeThread.id, {
      id: createId(),
      role: "user",
      content,
      ts: now(),
    });
    setSending(true);
    try {
      const response = await mockAiRespond(content, {
        ...activeThread.context,
        ...pageContext,
      });
      appendMessage(activeThread.id, {
        id: createId(),
        role: "assistant",
        content: response,
        ts: now(),
      });
    } finally {
      setSending(false);
    }
  };

  if (collapsed) return null;

  return (
    <div className={styles.quickAssistCard}>
      <div className={styles.quickAssistHeader}>
        <div>
          <div className={styles.quickAssistTitle}>AI hỗ trợ nhanh</div>
          <div className={styles.quickAssistSubtext}>Theo ngữ cảnh nguồn tin &amp; phân loại</div>
        </div>
        <Button size="small" onClick={() => setDrawerOpen(true)}>
          Mở rộng
        </Button>
      </div>

      <div className={styles.quickAssistButtons}>
        {QUICK_PROMPTS.map((prompt) => (
          <Button key={prompt} size="small" onClick={() => sendMessage(prompt)} disabled={sending}>
            {prompt}
          </Button>
        ))}
      </div>

      <div className={styles.quickAssistPreview}>
        {previewMessages.length === 0 ? (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Chưa có hội thoại. Hãy chọn một gợi ý hoặc nhập câu hỏi.
          </Text>
        ) : (
          previewMessages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? styles.quickAssistBubbleUser
                  : styles.quickAssistBubbleAssistant
              }
            >
              {renderMessageContent(message.content)}
              {message.role === "assistant" &&
                message.id === lastAssistantId &&
                (message.content.includes("Đề xuất xử lý") || showApplyActions) && (
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <Button size="small" onClick={() => dispatchWizardEvent("verify")}>
                      Áp dụng: Chuyển xác minh
                    </Button>
                    <Button size="small" type="primary" onClick={() => dispatchWizardEvent("plan")}>
                      Áp dụng: Đưa vào kế hoạch
                    </Button>
                  </div>
                )}
            </div>
          ))
        )}
      </div>

      <div className={styles.quickAssistInputRow}>
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onPressEnter={() => sendMessage(inputValue)}
          placeholder="Nhập câu hỏi nhanh..."
          size="small"
          disabled={!activeThread || sending}
        />
        <Button
          type="primary"
          size="small"
          icon={sending ? <Spin size="small" /> : <SendOutlined />}
          onClick={() => sendMessage(inputValue)}
          disabled={!activeThread || sending || !inputValue.trim()}
        />
      </div>

      <div className={styles.quickAssistCommands}>
        {["/tomtat", "/dexuat", "/yeucau_bosung"].map((command) => (
          <Button
            key={command}
            size="small"
            onClick={() => sendMessage(command)}
            disabled={!activeThread || sending}
          >
            {command}
          </Button>
        ))}
      </div>
    </div>
  );
}
