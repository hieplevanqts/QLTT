export type SelectedLeadMeta = {
  id: string;
  code: string;
  title: string;
  categoryLabel?: string;
  locationText?: string;
  wardLabel?: string;
  reliability?: number;
  status?: string;
  hasVideo?: boolean;
  hasImage?: boolean;
};

export type AssistantContext = {
  page?: string;
  focus?: {
    kind: "lead" | "tag" | null;
    leadId?: string;
    tag?: string;
  };
  selectedTag?: string;
  selectedLeadIds?: string[];
  selectedLeads?: SelectedLeadMeta[];
};

const HIGH_RISK_TAGS = ["ATTP", "Dược phẩm", "Mỹ phẩm", "Hàng giả"];

const STOPWORDS = new Set([
  "và",
  "là",
  "có",
  "của",
  "tại",
  "trên",
  "về",
  "với",
  "khi",
  "đã",
  "đang",
  "từ",
  "cho",
  "một",
  "những",
  "các",
  "không",
  "nghi",
  "vấn",
  "bán",
  "hàng",
  "giả",
  "sai",
  "sự",
  "thật",
  "vụ",
  "việc",
  "phát",
  "hiện",
  "cửa",
  "hàng",
  "thực",
  "phẩm",
  "kho",
  "lậu",
]);

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const calcPriority = (lead: SelectedLeadMeta) => {
  const base = lead.reliability ?? 70;
  const score = clamp(
    base +
      (lead.hasVideo ? 8 : 0) +
      (lead.hasImage ? 4 : 0) +
      (lead.categoryLabel && HIGH_RISK_TAGS.includes(lead.categoryLabel) ? 6 : 0) +
      (lead.status === "khong_dang" ? -10 : 0)
  );

  let level = "Thấp";
  if (score >= 85) level = "Khẩn";
  else if (score >= 70) level = "Cao";
  else if (score >= 50) level = "Trung bình";

  return { score, level };
};

export const calcRecommendedAction = (
  tag: string | undefined,
  priority: string,
  hasStrongEvidence: boolean
) => {
  if (hasStrongEvidence || priority === "Khẩn") {
    return "Chuyển bộ phận xác minh";
  }
  if (tag && HIGH_RISK_TAGS.includes(tag)) {
    return "Đưa vào kế hoạch kiểm tra";
  }
  if (tag && ["Quảng cáo", "Gian lận giá"].includes(tag)) {
    return "Yêu cầu bổ sung";
  }
  return "Chuyển bộ phận xác minh";
};

const extractKeywords = (titles: string[]) => {
  const counts = new Map<string, number>();
  titles.forEach((title) => {
    title
      .toLowerCase()
      .split(/[^a-zàáảãạâấầẩẫậăắằẳẵặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ0-9]+/gi)
      .filter((word) => word.length >= 3 && !STOPWORDS.has(word))
      .forEach((word) => {
        counts.set(word, (counts.get(word) ?? 0) + 1);
      });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
};

const topItems = (items: (string | undefined)[]) => {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    if (!item) return;
    counts.set(item, (counts.get(item) ?? 0) + 1);
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([value]) => value);
};

const formatCodes = (leads: SelectedLeadMeta[]) => {
  const codes = leads.map((lead) => lead.code || lead.id);
  const max = 6;
  const displayed = codes.slice(0, max);
  const remainder = codes.length - displayed.length;
  return remainder > 0 ? `${displayed.join(", ")}, +${remainder}` : displayed.join(", ");
};

const resolveTag = (context: AssistantContext) => {
  if (context.selectedTag) return context.selectedTag;
  const tags = context.selectedLeads?.map((lead) => lead.categoryLabel) ?? [];
  return topItems(tags)[0];
};

const buildSummary = (context: AssistantContext) => {
  const leads = context.selectedLeads ?? [];
  const total = leads.length;
  const tag = resolveTag(context);
  const wards = topItems(leads.map((lead) => lead.wardLabel || lead.locationText));
  const keywords = extractKeywords(leads.map((lead) => lead.title));
  const hasVideoCount = leads.filter((lead) => lead.hasVideo).length;
  const hasImageCount = leads.filter((lead) => lead.hasImage).length;
  const reliabilityAvg = Math.round(
    average(leads.map((lead) => lead.reliability ?? 70)) || 72
  );
  const priorityScore = Math.round(
    average(leads.map((lead) => calcPriority(lead).score)) || reliabilityAvg
  );
  const priorityLevel = calcPriority({ reliability: priorityScore }).level;
  const action = calcRecommendedAction(tag, priorityLevel, hasVideoCount > 0);

  return {
    total,
    tag,
    wards,
    keywords,
    hasVideoCount,
    hasImageCount,
    reliabilityAvg,
    priorityScore,
    priorityLevel,
    action,
  };
};

const renderAnalysisHeader = (context: AssistantContext) => {
  const leads = context.selectedLeads ?? [];
  if (!leads.length) {
    const count = context.selectedLeadIds?.length ?? 0;
    return count ? `**Đang phân tích:** ${count} tin đã chọn` : "";
  }
  const codes = formatCodes(leads);
  return `**Đang phân tích:** ${leads.length} tin (${codes})`;
};

const summarySection = (context: AssistantContext) => {
  const summary = buildSummary(context);
  return [
    "### 1) Tóm tắt nhanh",
    `- Danh mục: ${summary.tag ?? "Chưa xác định"}`,
    summary.wards.length
      ? `- Địa bàn nổi bật: ${summary.wards.join(", ")}`
      : "- Địa bàn nổi bật: Chưa có dữ liệu",
    summary.keywords.length
      ? `- Dấu hiệu chính: ${summary.keywords.join(", ")}`
      : "- Dấu hiệu chính: Đang cập nhật thêm",
    summary.total
      ? `- Bằng chứng: ${summary.hasVideoCount}/${summary.total} tin có video; ${summary.hasImageCount}/${summary.total} tin có ảnh`
      : "- Bằng chứng: Chưa có dữ liệu rõ ràng",
  ].join("\n");
};

const singleLeadSummarySection = (lead: SelectedLeadMeta) => {
  return [
    "### 1) Tóm tắt nhanh",
    `- Mã tin: ${lead.code || lead.id}`,
    `- Danh mục: ${lead.categoryLabel ?? "Chưa xác định"}`,
    `- Địa bàn: ${lead.wardLabel || lead.locationText || "Chưa cập nhật"}`,
    `- Dấu hiệu chính: ${lead.title}`,
    `- Bằng chứng: ${lead.hasVideo ? "Có video" : "Không có video"}, ${lead.hasImage ? "có ảnh" : "không có ảnh"}`,
  ].join("\n");
};

const missingSelectionMessage = () =>
  [
    "Chưa có tin đang chọn. Vui lòng chọn 1 tin hoặc 1 danh mục để tóm tắt.",
    "- Click 1 tin ở cột trái (Nguồn tin).",
    "- Hoặc click 1 panel danh mục để lấy tổng quan theo nhóm.",
  ].join("\n");

const riskSection = (context: AssistantContext) => {
  const summary = buildSummary(context);
  return [
    "### 2) Đánh giá rủi ro",
    `- Mức ưu tiên: **${summary.priorityLevel}**`,
    `- Độ tin cậy tổng hợp: **${summary.reliabilityAvg}%**`,
    `- Chỉ số ưu tiên (giả lập): ${summary.priorityScore}/100`,
  ].join("\n");
};

const proposeSection = (context: AssistantContext) => {
  const summary = buildSummary(context);
  const action = summary.action;
  const followUp =
    action === "Yêu cầu bổ sung"
      ? "Đưa vào kế hoạch kiểm tra (48–72h) khi đủ chứng cứ."
      : "Yêu cầu bổ sung (nếu thiếu thông tin) trong 24h.";
  return [
    "### 3) Đề xuất xử lý (khuyến nghị)",
    `1. **${action}** (trong 24h): ưu tiên tin có video/độ tin cậy > 85%.`,
    "2. **Đưa vào kế hoạch kiểm tra** (48–72h): gom theo cụm địa bàn để tối ưu lực lượng.",
    `3. **${followUp}**`,
  ].join("\n");
};

const supplementSection = () =>
  [
    "### 4) Thông tin cần bổ sung (mẫu)",
    "- Địa chỉ cụ thể cơ sở/điểm bán, thời điểm xảy ra, hình ảnh/clip rõ nhãn mác",
    "- Bảng giá/niêm yết giá; chứng từ nguồn gốc (nếu có)",
    "- Link bài đăng/ID bài viết (nếu phản ánh online)",
  ].join("\n");

const complianceSection = () =>
  [
    "### 5) Ghi chú nghiệp vụ",
    "- Ưu tiên xử lý theo nhóm rủi ro: ATTP/Dược phẩm/Hàng giả > Gian lận giá > Quảng cáo",
    "- Tránh kết luận khi chưa xác minh; ghi nhận “nghi vấn/đề xuất kiểm tra”.",
  ].join("\n");

const requestTemplate = () =>
  [
    "**Mẫu yêu cầu bổ sung thông tin**",
    "Kính đề nghị Ông/Bà cung cấp thêm thông tin để phục vụ công tác xác minh:",
    "1) Địa chỉ cụ thể cơ sở/điểm bán (số nhà, đường, phường/quận).",
    "2) Thời điểm ghi nhận vi phạm.",
    "3) Hình ảnh/clip thể hiện rõ: nhãn mác, nguồn gốc, bảng giá/niêm yết, hoá đơn (nếu có).",
    "4) Link bài đăng/ID bài viết (nếu phản ánh từ mạng xã hội).",
    "Trân trọng.",
  ].join("\n");

const transferTemplate = (context: AssistantContext) => {
  const summary = buildSummary(context);
  const leads = context.selectedLeads ?? [];
  return [
    "**Phiếu chuyển xác minh (mẫu)**",
    `- Danh mục: ${summary.tag ?? "Chưa xác định"}`,
    `- Địa bàn: ${summary.wards.join(", ") || "Chưa tổng hợp"}`,
    `- Danh sách tin: ${leads.length ? formatCodes(leads) : "Chưa có"}`,
    `- Mức ưu tiên: ${summary.priorityLevel}`,
    "- Đề nghị đơn vị tiếp nhận: kiểm tra, xác minh bằng chứng, liên hệ người phản ánh (nếu cần), báo cáo kết quả trước 24h.",
  ].join("\n");
};

const planTemplate = (context: AssistantContext) => {
  const summary = buildSummary(context);
  const leads = context.selectedLeads ?? [];
  return [
    "**Đề xuất đưa vào kế hoạch kiểm tra**",
    `- Mục tiêu: xác minh phản ánh ${summary.tag ?? "theo nhóm ưu tiên"} tại ${summary.wards.join(", ") || "cụm địa bàn liên quan"}`,
    `- Phạm vi: ${leads.length || "Nhiều"} tin, ưu tiên tin có bằng chứng video/ảnh`,
    "- Thời hạn: 48–72h",
    "- Đầu mối: bộ phận chuyên trách theo phân công",
    "- Kết quả mong đợi: biên bản kiểm tra, xác minh nguồn gốc/niêm yết giá/xử lý vi phạm (nếu có)",
  ].join("\n");
};

const guessIntent = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("/tomtat") || lower.includes("tóm tắt") || lower.includes("tổng hợp")) {
    return "summary";
  }
  if (lower.includes("/dexuat") || lower.includes("đề xuất") || lower.includes("xử lý")) {
    return "proposal";
  }
  if (
    lower.includes("/yeucau_bosung") ||
    lower.includes("yêu cầu bổ sung") ||
    lower.includes("soạn")
  ) {
    return "request";
  }
  if (lower.includes("chuyển") && lower.includes("xác minh")) {
    return "transfer";
  }
  if (lower.includes("đưa vào kế hoạch")) {
    return "plan";
  }
  return "general";
};

export async function mockAiRespond(userText: string, context?: AssistantContext) {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const ctx = context ?? {};
  const intent = guessIntent(userText);
  const header = renderAnalysisHeader(ctx);
  const leads = ctx.selectedLeads ?? [];
  const focusKind = ctx.focus?.kind ?? null;

  await sleep(350 + Math.floor(Math.random() * 250));

  if (!leads.length) {
    if (intent === "summary" || intent === "proposal" || intent === "request" || intent === "transfer" || intent === "plan") {
      return [header, missingSelectionMessage()].filter(Boolean).join("\n\n");
    }
  }

  if (intent === "summary") {
    if (focusKind === "lead" && leads.length === 1) {
      return [header, singleLeadSummarySection(leads[0]), riskSection(ctx)]
        .filter(Boolean)
        .join("\n\n");
    }
    return [header, summarySection(ctx), riskSection(ctx)]
      .filter(Boolean)
      .join("\n\n");
  }

  if (intent === "proposal") {
    return [header, riskSection(ctx), proposeSection(ctx), complianceSection()]
      .filter(Boolean)
      .join("\n\n");
  }

  if (intent === "request") {
    return [header, requestTemplate()].filter(Boolean).join("\n\n");
  }

  if (intent === "transfer") {
    return [header, transferTemplate(ctx)].filter(Boolean).join("\n\n");
  }

  if (intent === "plan") {
    return [header, planTemplate(ctx)].filter(Boolean).join("\n\n");
  }

  return [
    header,
    leads.length ? summarySection(ctx) : missingSelectionMessage(),
    "",
    "### Gợi ý thao tác tiếp theo",
    "- Gõ ` /tomtat ` để nhận tóm tắt nhanh",
    "- Gõ ` /dexuat ` để nhận đề xuất xử lý",
    "- Gõ ` /yeucau_bosung ` để soạn mẫu yêu cầu bổ sung",
  ]
    .filter(Boolean)
    .join("\n");
}
