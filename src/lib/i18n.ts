export type Locale = "en" | "zh";

const dict = {
  // --- Left sidebar ---
  name: { en: "ChangGe", zh: "长歌" },
  bio: {
    en: "Builder · Tinkerer · Minimalist\nIndie Dev · AI Artist · Crafting Tools",
    zh: "独立开发者 / AI美学探索者 / 自媒体\n折腾工具，探索美学，极简主义。",
  },
  // --- WeChat QR popup ---
  wechatQR: {
    en: "Scan the art QR code above\nor add ",
    zh: "扫描上方艺术二维码\n或添加 ",
  },
  // --- Tools section ---
  sectionTools: { en: "Tools & Projects", zh: "工具 & 项目" },
  "tool.paste.title": { en: "Paste", zh: "Paste 剪贴板" },
  "tool.paste.desc": {
    en: "Lightweight online clipboard with syntax highlighting & temp sharing",
    zh: "轻量在线剪贴板，支持代码高亮与临时分享",
  },
  "tool.link2asr.title": { en: "Link2ASR", zh: "Link2ASR 语音转写" },
  "tool.link2asr.desc": {
    en: "Paste a link, auto-extract audio and transcribe to text",
    zh: "粘贴链接，自动提取音频并转写为文字",
  },
  "tool.civitai.title": { en: "Civitai Aesthetics", zh: "Civitai 美学探索" },
  "tool.civitai.desc": {
    en: "AI aesthetics analysis workbench for Civitai models & images",
    zh: "AI 美学分析工作台，探索 Civitai 模型与图像美学",
  },
  tagTool: { en: "Tool", zh: "工具" },
  tagProject: { en: "Project", zh: "项目" },
  // --- Probe status ---
  probing: { en: "Probing…", zh: "探测中…" },
  nodeUp: { en: "Node available", zh: "节点可用" },
  nodeDown: { en: "Node offline", zh: "节点离线" },
  // --- Articles section ---
  sectionPosts: { en: "Recent Posts", zh: "近期文章" },
  "article.1.title": {
    en: "Building a Minimal CLI in Rust",
    zh: "用 Rust 构建极简 CLI 工具",
  },
  "article.2.title": {
    en: "Why I Moved to Azure Static Web Apps",
    zh: "为什么我迁移到 Azure 静态网站",
  },
  "article.3.title": {
    en: "Reverse Engineering a Smart Lock Protocol",
    zh: "逆向工程一个智能门锁协议",
  },
  // --- Status bar ---
  statusOk: { en: "All systems operational", zh: "全部系统运行正常" },
  lastDeploy: { en: "Last deploy: just now", zh: "最近部署：刚刚" },
  // --- Footer ---
  builtWith: { en: "Built with", zh: "构建于" },
  deployedOn: { en: "Deployed on", zh: "部署于" },
  // --- Lang toggle ---
  switchLang: { en: "中", zh: "EN" },
} as const;

export type TransKey = keyof typeof dict;

export function t(key: TransKey, locale: Locale): string {
  return dict[key][locale];
}
