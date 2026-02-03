import { pickEvidence } from "@/modules/lead-risk/mocks/evidenceAssets";
import { PEOPLE_POOL } from "@/modules/lead-risk/mocks/peoplePool";
import { LOCATION_POOL, formatLocationText, formatWardLabel } from "@/modules/lead-risk/mocks/locationPool";

export type EvidenceImage = { url: string; caption?: string };
export type EvidenceVideo =
  | { kind: "youtube"; url: string; title?: string }
  | { kind: "file"; url: string; title?: string; mime?: string; poster?: string };

export type ReporterChannel = "Hotline" | "Zalo" | "Facebook" | "Email" | "Trực tiếp";
export type LeadStatus = "can_xem_xet" | "dang_xu_ly" | "khong_dang";

export type LeadMock = {
  id: string;
  code: string;
  title: string;
  reporterName: string;
  reporterPhone?: string;
  reporterChannel?: ReporterChannel;
  reporterHistory?: number;
  reportDate: string;
  locationText: string;
  wardLabel?: string;
  category: string;
  categoryLabel: string;
  status: LeadStatus;
  timestamp: Date;
  priority: "high" | "medium" | "low";
  isRead: boolean;
  evidence?: {
    images?: EvidenceImage[];
    videos?: EvidenceVideo[];
  };
  ai: {
    verdict: "worthy" | "unworthy" | "review";
    confidence: number;
    summary: string;
    recommendation: string;
    violations: string[];
    severity: string;
    evidenceQuality: string;
    similarCases: number;
  };
};

const CHANNELS: ReporterChannel[] = ["Hotline", "Zalo", "Facebook", "Email", "Trực tiếp"];

const youtubeVideos: EvidenceVideo[] = [
  {
    kind: "youtube",
    url: "https://www.youtube.com/watch?v=x_oBxBxlYJQ",
    title: "Chống hàng giả - phóng sự",
  },
  {
    kind: "youtube",
    url: "https://www.youtube.com/watch?v=TWMCJBhCAQ8",
    title: "Hàng giả, hàng nhái tràn lan",
  },
  {
    kind: "youtube",
    url: "https://www.youtube.com/watch?v=y93S5po5ZqU",
    title: "Thực phẩm không rõ nguồn gốc",
  },
  {
    kind: "youtube",
    url: "https://www.youtube.com/watch?v=a2_L_EEYlkc",
    title: "Nguồn cung thực phẩm/bếp ăn",
  },
  {
    kind: "youtube",
    url: "https://www.youtube.com/watch?v=_6qGw77m-Ew",
    title: "Hàng giả tràn lan trên mạng",
  },
  {
    kind: "youtube",
    url: "https://www.youtube.com/watch?v=-QT0fEdNv1w",
    title: "Thực phẩm kém chất lượng",
  },
];

const seedFromString = (input: string) => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const pickStable = <T,>(items: T[], seedKey: string) => {
  const rand = mulberry32(seedFromString(seedKey));
  return items[Math.floor(rand() * items.length)];
};

export const pickReporterBySeed = (seedKey: string) => {
  const person = pickStable(PEOPLE_POOL, `${seedKey}-person`);
  const channel = pickStable(CHANNELS, `${seedKey}-channel`);
  const history = 1 + Math.floor(mulberry32(seedFromString(`${seedKey}-history`))() * 5);
  return {
    reporterName: person.name,
    reporterPhone: person.phone,
    reporterChannel: channel,
    reporterHistory: history,
  };
};

export const pickLocationBySeed = (seedKey: string) => {
  const loc = pickStable(LOCATION_POOL, `${seedKey}-loc`);
  return {
    locationText: formatLocationText(loc),
    wardLabel: formatWardLabel(loc),
  };
};

export const leadInboxMock: LeadMock[] = [
  {
    id: "1",
    code: "LD-2025-315",
    title: "Quảng cáo sai sự thật về thuốc",
    ...pickReporterBySeed("1"),
    ...pickLocationBySeed("1"),
    reportDate: "03/02/2026",
    category: "Quảng cáo",
    categoryLabel: "Quảng cáo",
    status: "can_xem_xet",
    timestamp: new Date(Date.now() - 2 * 60000),
    priority: "medium",
    isRead: false,
    evidence: {
      videos: [youtubeVideos[4]],
      images: pickEvidence("Quảng cáo", 2, "1"),
    },
    ai: {
      verdict: "review",
      confidence: 74,
      summary: "Nội dung quảng cáo có dấu hiệu thổi phồng công dụng thuốc.",
      recommendation: "Cần thu thập thêm tài liệu quảng cáo và xác minh giấy phép.",
      violations: ["Quảng cáo sai sự thật"],
      severity: "Trung bình",
      evidenceQuality: "Trung bình",
      similarCases: 2,
    },
  },
  {
    id: "2",
    code: "LD-2025-970",
    title: "Nghi vấn bán hàng giả trên Facebook",
    ...pickReporterBySeed("2"),
    ...pickLocationBySeed("2"),
    reportDate: "03/02/2026",
    category: "Hàng giả",
    categoryLabel: "Hàng giả",
    status: "khong_dang",
    timestamp: new Date(Date.now() - 10 * 60000),
    priority: "low",
    isRead: false,
    evidence: {
      videos: [youtubeVideos[0]],
      images: pickEvidence("Hàng giả", 1, "2"),
    },
    ai: {
      verdict: "unworthy",
      confidence: 86,
      summary: "Nguồn tin trùng lặp với các phản ánh trước đó.",
      recommendation: "Đối chiếu dữ liệu và gộp hồ sơ nếu trùng lặp.",
      violations: ["Nghi vấn hàng giả"],
      severity: "Thấp",
      evidenceQuality: "Trung bình",
      similarCases: 3,
    },
  },
  {
    id: "3",
    code: "LD-2025-983",
    title: "Cửa hàng thực phẩm bẩn",
    ...pickReporterBySeed("3"),
    ...pickLocationBySeed("3"),
    reportDate: "03/02/2026",
    category: "ATTP",
    categoryLabel: "ATTP",
    status: "can_xem_xet",
    timestamp: new Date(Date.now() - 25 * 60000),
    priority: "low",
    isRead: false,
    evidence: {
      videos: [youtubeVideos[2]],
      images: pickEvidence("ATTP", 2, "3"),
    },
    ai: {
      verdict: "review",
      confidence: 70,
      summary: "Phản ánh vệ sinh thực phẩm kém tại cửa hàng.",
      recommendation: "Cần kiểm tra đột xuất và lấy mẫu.",
      violations: ["ATTP"],
      severity: "Trung bình",
      evidenceQuality: "Tốt",
      similarCases: 1,
    },
  },
  {
    id: "4",
    code: "LD-2025-925",
    title: "Cửa hàng thực phẩm bẩn",
    ...pickReporterBySeed("4"),
    ...pickLocationBySeed("4"),
    reportDate: "03/02/2026",
    category: "ATTP",
    categoryLabel: "ATTP",
    status: "can_xem_xet",
    timestamp: new Date(Date.now() - 45 * 60000),
    priority: "medium",
    isRead: false,
    evidence: {
      videos: [youtubeVideos[5]],
      images: pickEvidence("ATTP", 2, "4"),
    },
    ai: {
      verdict: "review",
      confidence: 77,
      summary: "Nguồn tin phản ánh thực phẩm kém chất lượng.",
      recommendation: "Cần xác minh nguồn gốc thực phẩm.",
      violations: ["ATTP"],
      severity: "Trung bình",
      evidenceQuality: "Trung bình",
      similarCases: 1,
    },
  },
  {
    id: "5",
    code: "LD-2025-207",
    title: "Nghi vấn bán hàng giả trên Facebook",
    ...pickReporterBySeed("5"),
    ...pickLocationBySeed("5"),
    reportDate: "03/02/2026",
    category: "Hàng giả",
    categoryLabel: "Hàng giả",
    status: "khong_dang",
    timestamp: new Date(Date.now() - 60 * 60000),
    priority: "low",
    isRead: true,
    evidence: {
      videos: [youtubeVideos[1]],
      images: pickEvidence("Hàng giả", 1, "5"),
    },
    ai: {
      verdict: "unworthy",
      confidence: 94,
      summary: "Nguồn tin thiếu thông tin định danh người bán.",
      recommendation: "Yêu cầu người phản ánh cung cấp thêm bằng chứng.",
      violations: ["Nghi vấn hàng giả"],
      severity: "Thấp",
      evidenceQuality: "Yếu",
      similarCases: 1,
    },
  },
  {
    id: "6",
    code: "LD-2025-563",
    title: "Cửa hàng thực phẩm bán không rõ nguồn gốc",
    ...pickReporterBySeed("6"),
    ...pickLocationBySeed("6"),
    reportDate: "03/02/2026",
    category: "Nguồn gốc",
    categoryLabel: "Nguồn gốc",
    status: "can_xem_xet",
    timestamp: new Date(Date.now() - 90 * 60000),
    priority: "low",
    isRead: true,
    evidence: {
      videos: [youtubeVideos[3]],
      images: pickEvidence("Nguồn gốc", 2, "6"),
    },
    ai: {
      verdict: "review",
      confidence: 83,
      summary: "Phản ánh thực phẩm không rõ nguồn gốc, cần xác minh.",
      recommendation: "Kiểm tra hồ sơ nhập hàng và điều kiện lưu trữ.",
      violations: ["Nguồn gốc"],
      severity: "Trung bình",
      evidenceQuality: "Tốt",
      similarCases: 2,
    },
  },
  {
    id: "7",
    code: "LD-2025-812",
    title: "Nghi vấn tăng giá bất hợp lý dịp Tết",
    ...pickReporterBySeed("7"),
    ...pickLocationBySeed("7"),
    reportDate: "03/02/2026",
    category: "Gian lận giá",
    categoryLabel: "Gian lận giá",
    status: "can_xem_xet",
    timestamp: new Date(Date.now() - 120 * 60000),
    priority: "medium",
    isRead: true,
    evidence: {
      images: pickEvidence("Gian lận giá", 2, "7"),
    },
    ai: {
      verdict: "review",
      confidence: 69,
      summary: "Giá bán cao hơn niêm yết, cần đối chiếu chứng từ.",
      recommendation: "Yêu cầu cung cấp hóa đơn và bảng giá.",
      violations: ["Gian lận giá"],
      severity: "Trung bình",
      evidenceQuality: "Yếu",
      similarCases: 0,
    },
  },
];
