import React from "react";
import { Typography } from "antd";

const { Text, Title } = Typography;

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>
      );
    }
    return <span key={`text-${index}`}>{part}</span>;
  });
};

export const renderMessageContent = (content: string) => {
  const lines = content.split(/\r?\n/);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={`space-${index}`} style={{ height: 4 }} />;
        }

        if (trimmed.startsWith("###")) {
          return (
            <Title
              key={`title-${index}`}
              level={5}
              style={{ margin: "6px 0 2px", color: "inherit" }}
            >
              {renderInline(trimmed.replace(/^###\s*/, ""))}
            </Title>
          );
        }

        const ordered = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (ordered) {
          return (
            <div key={`ordered-${index}`} style={{ display: "flex", gap: 6 }}>
              <Text strong style={{ color: "inherit" }}>
                {ordered[1]}.
              </Text>
              <Text style={{ color: "inherit" }}>{renderInline(ordered[2])}</Text>
            </div>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <div key={`bullet-${index}`} style={{ display: "flex", gap: 6 }}>
              <span>•</span>
              <Text style={{ color: "inherit" }}>{renderInline(trimmed.slice(2))}</Text>
            </div>
          );
        }

        return (
          <Text key={`line-${index}`} style={{ color: "inherit" }}>
            {renderInline(trimmed)}
          </Text>
        );
      })}
    </div>
  );
};
