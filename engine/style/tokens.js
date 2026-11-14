// 视觉 token v2（深色海报，见 docs/视觉规范.md）。全课统一，场景里不要写裸色值。
// 语义名沿用 v1：paper = 底色，ink = 前景主色（现在是奶油色），peri = 强调色（现在是橙）。
export const C = {
  paper: '#121010', paperHi: '#0B0A09', ink: '#F2E2C8', inkMid: '#A89982',
  peri: '#E06A3A', periLt: '#F0955F', mist: '#6E6253', ghost: '#3A322B',
  disc: '#211915', discRim: '#4A3A2E',
  // 网格：原始网格 = 淡奶油（始终可见），变换后网格 = 橙
  gridOld: '#F2E2C8', gridNew: '#E06A3A',
  // 数学语义（深底上互相可分辨，也不和橙色网格撞色）
  i: '#F2B544', j: '#4FC1A6', k: '#8C9DFF', vec: '#F2E2C8', free: '#E8577A',
  // 角色
  claude: '#DF763F', claudeLt: '#DF763F', gpt: '#3FA88E', gptLt: '#3FA88E', ds: '#4D6BFE', dsLt: '#4D6BFE',
  shadowClaude: '#7A3517', shadowGpt: '#1D5446', shadowDs: '#22318A',
};
export const F = {
  serif: (px, w = 900) => `${w} ${px}px "LA-Serif", "LA-Latin", serif`,
  sans: (px, w = 500) => `${w} ${px}px "LA-Latin", "LA-Sans", sans-serif`,
};
export const W = 1920, H = 1080;
export const SPEAKER = {
  C: { name: 'Claude', color: C.claude, circle: C.claudeLt },
  G: { name: 'GPT', color: C.gpt, circle: C.gpt },
  D: { name: '大肥鱼', color: C.ds, circle: C.dsLt },
};
