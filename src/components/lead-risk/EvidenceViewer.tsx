import React from "react";
import { Image, Typography } from "antd";
import type { EvidenceImage, EvidenceVideo } from "@/modules/lead-risk/mocks/leadInboxMock";
import { EVIDENCE_FALLBACK_IMAGE } from "@/modules/lead-risk/mocks/evidenceAssets";

const { Text } = Typography;

type Evidence = {
  images?: EvidenceImage[];
  videos?: EvidenceVideo[];
};

type Props = {
  evidence?: Evidence;
};

function toYouTubeEmbed(url: string) {
  const idMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  const id = idMatch?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
}

export default function EvidenceViewer({ evidence }: Props) {
  const images = evidence?.images ?? [];
  const videos = evidence?.videos ?? [];
  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;

  if (!hasImages && !hasVideos) {
    return (
      <div
        style={{
          padding: 20,
          textAlign: "center",
          background: "var(--muted)",
          borderRadius: 8,
          color: "var(--muted-foreground)",
          fontSize: 13,
        }}
      >
        Không có hình ảnh đính kèm
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {hasImages && (
        <Image.PreviewGroup>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 8,
            }}
          >
            {images.map((img, idx) => (
              <Image
                key={`${img.url}-${idx}`}
                src={img.url}
                alt={img.caption || `Evidence ${idx + 1}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  const target = event.currentTarget as HTMLImageElement;
                  if (target?.src && target.src !== EVIDENCE_FALLBACK_IMAGE) {
                    target.src = EVIDENCE_FALLBACK_IMAGE;
                  }
                }}
                style={{
                  width: "100%",
                  height: 110,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
        </Image.PreviewGroup>
      )}

      {hasVideos && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Text strong style={{ fontSize: 13 }}>
            Video bằng chứng
          </Text>
          {videos.map((video, idx) => (
            <div key={`${video.url}-${idx}`} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {video.title && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {video.title}
                </Text>
              )}
              {video.kind === "youtube" ? (
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    src={toYouTubeEmbed(video.url)}
                    title={video.title || "Video bằng chứng"}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                      borderRadius: 8,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video controls style={{ width: "100%", borderRadius: 8 }}>
                  <source src={video.url} type={video.mime || "video/mp4"} />
                  Trình duyệt không hỗ trợ phát video.
                </video>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
