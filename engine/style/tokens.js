// 视觉 token（见 docs/视觉规范.md）。全课统一，场景里不要写裸色值。
export const C = {
  paper: '#EDE7DA', paperHi: '#F5EBDC', ink: '#302959', inkMid: '#5B5E90',
  peri: '#748DD8', periLt: '#95A2DC', mist: '#ABB5DE', ghost: '#CFCDD5',
  // 数学语义
  i: '#C8643C', j: '#3E8E7E', k: '#D9A441', vec: '#302959', free: '#B04A7A',
  // 角色
  claude: '#C8643C', claudeLt: '#E9B79A', gpt: '#2F6B5A', gptLt: '#A9C9BD', ds: '#748DD8', dsLt: '#95A2DC',
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
