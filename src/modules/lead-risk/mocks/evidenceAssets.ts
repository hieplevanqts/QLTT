export type EvidenceImageAsset = { url: string; caption: string };

export const EVIDENCE_IMAGES_BY_TAG: Record<string, EvidenceImageAsset[]> = {
  ATTP: [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03475.JPG",
      caption: "Chợ Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03470.JPG",
      caption: "Chợ đường phố Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Meat%20in%20street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03469.JPG",
      caption: "Thực phẩm tươi sống tại chợ",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C%20Dong%20Xuan%20market%20%286225885496%29.jpg",
      caption: "Chợ Đồng Xuân, Hà Nội",
    },
  ],
  "Nguồn gốc": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03475.JPG",
      caption: "Chợ Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03470.JPG",
      caption: "Chợ đường phố Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C%20Dong%20Xuan%20market%20%286225885496%29.jpg",
      caption: "Chợ Đồng Xuân, Hà Nội",
    },
  ],
  "Giá cả": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03475.JPG",
      caption: "Chợ Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ngoc%20Ha%20Market%20Hanoi.JPG",
      caption: "Chợ Ngọc Hà",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C%20Dong%20Xuan%20market%20%286225885496%29.jpg",
      caption: "Chợ Đồng Xuân, Hà Nội",
    },
  ],
  "Gian lận giá": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03475.JPG",
      caption: "Chợ Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ngoc%20Ha%20Market%20Hanoi.JPG",
      caption: "Chợ Ngọc Hà",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C%20Dong%20Xuan%20market%20%286225885496%29.jpg",
      caption: "Chợ Đồng Xuân, Hà Nội",
    },
  ],
  "Hàng giả": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/CBP%20Officers%20Seize%20Counterfeit%20Goods%20%2848536232982%29.jpg",
      caption: "Hàng nghi giả bị tịch thu (minh hoạ)",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/ICE%20HSI%20Agents%20Seize%20More%20Than%20%24500%2C000%20Worth%20of%20Counterfeit%20Goods%20at%20Flea%20Market%20%2814794084057%29.jpg",
      caption: "Hàng giả bị tịch thu (minh hoạ)",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Counterfeit%20NFL%20Jerseys%20seized%20by%20CBP%20at%20JFK%20International%20Mail%20Facility%20%2812220876254%29.jpg",
      caption: "Hàng giả bị thu giữ (minh hoạ)",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/This%20counterfeit%20items%20are%20among%20millions%20of%20pounds%20worth%20of%20fake%20items%20seized%20by%20Border%20Force%20before%20Christmas%202012%20%281%29.jpg",
      caption: "Hàng giả bị thu giữ (minh hoạ)",
    },
  ],
  "Dược phẩm": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/CBP%20with%20bag%20of%20seized%20counterfeit%20Viagra.jpg",
      caption: "Dược phẩm nghi giả (minh hoạ)",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/CBP%20Officers%20Seize%20Counterfeit%20Goods%20%2848536232982%29.jpg",
      caption: "Hàng nghi giả bị tịch thu (minh hoạ)",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/This%20counterfeit%20items%20are%20among%20millions%20of%20pounds%20worth%20of%20fake%20items%20seized%20by%20Border%20Force%20before%20Christmas%202012%20%281%29.jpg",
      caption: "Hàng giả bị thu giữ (minh hoạ)",
    },
  ],
  "Mỹ phẩm": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/CBP%20with%20bag%20of%20seized%20counterfeit%20Viagra.jpg",
      caption: "Mỹ phẩm nghi giả (minh hoạ)",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/CBP%20Officers%20Seize%20Counterfeit%20Goods%20%2848536232982%29.jpg",
      caption: "Hàng nghi giả bị tịch thu (minh hoạ)",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/This%20counterfeit%20items%20are%20among%20millions%20of%20pounds%20worth%20of%20fake%20items%20seized%20by%20Border%20Force%20before%20Christmas%202012%20%281%29.jpg",
      caption: "Hàng giả bị thu giữ (minh hoạ)",
    },
  ],
  "Quảng cáo": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03475.JPG",
      caption: "Chợ Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C%20Dong%20Xuan%20market%20%286225885496%29.jpg",
      caption: "Chợ Đồng Xuân, Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/This%20counterfeit%20items%20are%20among%20millions%20of%20pounds%20worth%20of%20fake%20items%20seized%20by%20Border%20Force%20before%20Christmas%202012%20%281%29.jpg",
      caption: "Hàng giả bị thu giữ (minh hoạ)",
    },
  ],
  "Quảng cáo sai": [
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03475.JPG",
      caption: "Chợ Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C%20Dong%20Xuan%20market%20%286225885496%29.jpg",
      caption: "Chợ Đồng Xuân, Hà Nội",
    },
    {
      url: "https://commons.wikimedia.org/wiki/Special:FilePath/This%20counterfeit%20items%20are%20among%20millions%20of%20pounds%20worth%20of%20fake%20items%20seized%20by%20Border%20Force%20before%20Christmas%202012%20%281%29.jpg",
      caption: "Hàng giả bị thu giữ (minh hoạ)",
    },
  ],
};

export const EVIDENCE_FALLBACK_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Street%20market%20-%20Hanoi%2C%20Vietnam%20-%20DSC03475.JPG";

const hashString = (input: string) => {
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

const normalizeTag = (tag?: string) => {
  if (!tag) return "ATTP";
  const normalized = tag.toLowerCase();
  if (normalized.includes("attp") || normalized.includes("an toàn")) return "ATTP";
  if (normalized.includes("nguồn gốc") || normalized.includes("không nguồn gốc")) return "Nguồn gốc";
  if (normalized.includes("gian lận")) return "Gian lận giá";
  if (normalized.includes("giá")) return "Giá cả";
  if (normalized.includes("hàng giả")) return "Hàng giả";
  if (normalized.includes("dược")) return "Dược phẩm";
  if (normalized.includes("mỹ phẩm")) return "Mỹ phẩm";
  if (normalized.includes("quảng cáo")) return "Quảng cáo";
  return "ATTP";
};

export const pickEvidence = (tag: string, count: number, seedKey: string) => {
  const normalized = normalizeTag(tag);
  const pool = EVIDENCE_IMAGES_BY_TAG[normalized] || EVIDENCE_IMAGES_BY_TAG.ATTP;
  const rand = mulberry32(hashString(`${normalized}|${seedKey}`));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (count <= shuffled.length) return shuffled.slice(0, count);
  const result = [...shuffled];
  while (result.length < count) {
    result.push(shuffled[Math.floor(rand() * shuffled.length)]);
  }
  return result;
};
