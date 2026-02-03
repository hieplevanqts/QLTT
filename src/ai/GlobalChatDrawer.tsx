import { useEffect, useMemo, useState } from "react";
import { Drawer, Button, Input, Select, Typography, Empty, Space, Tag } from "antd";
import { PlusOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { useAssistant, mockAiRespond, createId, now } from "./assistantStore";
import { renderMessageContent } from "./renderMessage";

const { Text } = Typography;

export default function GlobalChatDrawer() {
  const {
    drawerOpen,
    setDrawerOpen,
    threads,
    activeThreadId,
    createThread,
    setActiveThread,
    appendMessage,
    clearThread,
    updateContext,
  } = useAssistant();

  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const quickCommands = [
    { label: "/tomtat", value: "/tomtat" },
    { label: "/dexuat", value: "/dexuat" },
    { label: "/yeucau_bosung", value: "/yeucau_bosung" },
  ];

  useEffect(() => {
    if (!threads.length) {
      const id = createThread("global", "Hội thoại chung");
      setActiveThread(id);
    } else if (!activeThreadId) {
      setActiveThread(threads[0]?.id ?? null);
    }
  }, [threads, activeThreadId, createThread, setActiveThread]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [threads, activeThreadId]
  );

  const threadContext = activeThread?.context;
  const contextFocus = threadContext?.focus;
  const selectedCount =
    threadContext?.selectedLeadIds?.length ?? threadContext?.selectedLeads?.length ?? 0;
  const focusedLead =
    threadContext?.selectedLeads?.find((lead) => lead.id === contextFocus?.leadId) ??
    threadContext?.selectedLeads?.[0];

  const showApplyActions =
    (threadContext?.selectedLeadIds?.length ?? 0) > 0 ||
    (threadContext?.selectedLeads?.length ?? 0) > 0;

  const dispatchWizardEvent = (action: "verify" | "plan") => {
    const detail = {
      action,
      tag: threadContext?.selectedTag ?? contextFocus?.tag,
      selectedIds: threadContext?.selectedLeadIds ?? [],
    };
    window.dispatchEvent(new CustomEvent("mappa:open-lead-wizard", { detail }));
  };

  const clearContext = () => {
    if (!activeThread) return;
    updateContext(activeThread.id, {
      focus: { kind: null },
      selectedLeadIds: [],
      selectedLeads: [],
      selectedTag: undefined,
    });
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content || !activeThread) return;
    setInputValue("");
    const userMessage = { id: createId(), role: "user" as const, content, ts: now() };
    appendMessage(activeThread.id, userMessage);
    setSending(true);
    try {
      const response = await mockAiRespond(content, activeThread.context);
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

  return (
    <Drawer
      title="Trợ lý AI"
      placement="right"
      width={460}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      destroyOnClose={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 12 }}>
        <div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Hội thoại
          </Text>
          <Select
            value={activeThreadId ?? undefined}
            onChange={(value) => setActiveThread(value)}
            options={threads.map((thread) => ({
              value: thread.id,
              label: thread.title,
            }))}
            style={{ width: "100%", marginTop: 6 }}
            size="middle"
            placeholder="Chọn hội thoại"
          />
        </div>

        {(contextFocus?.kind || selectedCount > 0) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            {contextFocus?.kind === "lead" && focusedLead && (
              <Tag color="blue">
                Tin: {focusedLead.code || focusedLead.id} •{" "}
                {focusedLead.categoryLabel || "Chưa rõ"} •{" "}
                {focusedLead.locationText || focusedLead.wardLabel || "Chưa rõ"}
              </Tag>
            )}
            {contextFocus?.kind === "tag" && (
              <Tag color="gold">
                Danh mục: {threadContext?.selectedTag || contextFocus?.tag || "Chưa rõ"} •{" "}
                {selectedCount} tin
              </Tag>
            )}
            {selectedCount > 0 && (
              <Tag color="default">Đã chọn: {selectedCount} tin</Tag>
            )}
            <Button size="small" onClick={clearContext}>
              Xoá ngữ cảnh
            </Button>
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 4px",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 8,
            background: "var(--card)",
          }}
        >
          {activeThread?.messages.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeThread.messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      background:
                        message.role === "user" ? "var(--primary)" : "var(--muted)",
                      color:
                        message.role === "user"
                          ? "var(--primary-foreground)"
                          : "var(--foreground)",
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}
                  >
                    {renderMessageContent(message.content)}
                  </div>
                  {message.role === "assistant" &&
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
              ))}
            </div>
          ) : (
            <Empty description="Chưa có tin nhắn" />
          )}
        </div>

        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onPressEnter={() => handleSend()}
            placeholder="Nhập nội dung..."
            disabled={!activeThread || sending}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            disabled={!activeThread || sending || !inputValue.trim()}
          />
        </Space.Compact>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {quickCommands.map((command) => (
            <Button
              key={command.value}
              size="small"
              onClick={() => handleSend(command.value)}
              disabled={!activeThread || sending}
            >
              {command.label}
            </Button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => createThread("global", `Hội thoại mới ${threads.length + 1}`)}
          >
            Tạo hội thoại mới
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={!activeThread}
            onClick={() => activeThread && clearThread(activeThread.id)}
          >
            Xoá hội thoại
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
